const Yup = require("yup");
const db = require("../db/index");
const socialHandler = require("../handlers/social");
const utils = require("../utils");

const validationSchema = Yup.object().shape({
  position: Yup.string().required("Required"),
  jobType: Yup.string().required("Required"),
  primaryTagId: Yup.number()
    .nullable()
    .test(
      "primaryTag-required",
      "Choose at least one tag here or enter a tag in the Extra Tags input below.",
      function(value) {
        const tags = this.parent.tags;
        if (!tags || tags.length === 0) {
          return !!value;
        }
        return true;
      }
    ),
  tags: Yup.array().test(
    "tags-required",
    "Please enter at least one tag here or choose a tag in the Primary Tag input above.",
    function(value) {
      const { primaryTagId } = this.parent;
      if (primaryTagId === null || primaryTagId === undefined) {
        return value && value.length > 0;
      }
      return true;
    }
  ),
  deadline: Yup.date()
    .nullable()
    .default(null),
  description: Yup.string().required("Required"),
  applyEmail: Yup.string()
    .nullable()
    .notRequired()
    .email(),
  companyName: Yup.string().when("hasCompany", {
    is: true,
    then: Yup.string().required("Required")
  }),
  companyEmail: Yup.string().when("hasCompany", {
    is: true,
    then: Yup.string()
      .email()
      .required("Required")
  })
});

exports.validateJobPost = async (req, res, next) => {
  const jobData = req.body;
  try {
    await validationSchema.validate(jobData, { abortEarly: false });
  } catch (error) {
    res.status(500).send({ error: error.inner });
    return;
  }
  next();
};

exports.createJob = async (req, res) => {
  const data = req.body;
  const {
    hasCompany,
    companyName,
    companyEmail,
    companyLogo,
    ...jobData
  } = data;
  let company = null;
  if (hasCompany) {
    company = {
      name: companyName,
      email: companyEmail,
      logo: companyLogo
    };
  }
  const isAdminUser = req.user && req.user.role === "admin";
  if (isAdminUser) {
    jobData.approved = true;
  }
  const resData = await db.createJobAndCompany({ company, job: jobData });
  if (isAdminUser) {
    socialHandler.postJobToSocialMedia(resData);
  }
  res.status(200).send(resData);
};

exports.getPrimaryTags = async (req, res) => {
  const tags = await db.getPrimaryTags();
  res.status(200).send(tags);
};

exports.getJobs = async (req, res) => {
  let data;
  const {
    cursor: encodedCursor,
    count: countStr = "30",
    tags = ""
  } = req.query;
  const fromJobId =
    typeof encodedCursor === "string" && encodedCursor !== ""
      ? parseInt(utils.base64decode(encodedCursor))
      : null;
  const count = parseInt(countStr);
  const tagIds = utils.tagIdsfromQueryParam(tags);
  const jobs = await db.getJobs({
    fromJobId,
    limit: count + 1,
    approved: true,
    withinDays: 30,
    tagIds,
    publicOnly: true
  });
  if (jobs.length < count + 1) {
    data = { jobs, nextCursor: "" };
  } else {
    data = {
      jobs: jobs.slice(0, -1),
      nextCursor: utils.base64encode(String(jobs[count].job.id))
    };
  }
  res.status(200).send(data);
};

exports.pendingJobs = async (_, res) => {
  const jobs = await db.getJobs({ approved: false });
  res.status(200).send(jobs);
};

exports.getJob = async (req, res) => {
  const { slug } = req.params;
  const jobData = await db.getJobBySlug(slug);
  if (jobData === null) {
    res.sendStatus(404);
    return;
  }
  const { adminToken } = req.query;
  const isJobAdmin = !!adminToken && jobData.job.adminToken === adminToken;

  if (!isJobAdmin) {
    jobData.job = jobData.job.publicData();
  }

  if ((jobData.job.closed || !jobData.job.approved) && !isJobAdmin) {
    res.sendStatus(404);
    return;
  }
  res.status(200).send(jobData);
};

exports.closeJob = async (req, res) => {
  const { id } = req.params;
  const affectedRows = await db.closeJob(id);
  if (affectedRows === 1) {
    res.status(200).send(true);
    const jobData = await db.getJobById(id);
    await socialHandler.postJobCloseToSocialMedia(jobData);
    db.deleteJobSocialPost(id);
    return;
  }
  res.sendStatus(404);
};

exports.approveJob = async (req, res) => {
  const { jobId } = req.body;
  const affectedRows = await db.approveJob(jobId);
  if (affectedRows === 1) {
    res.status(200).send(true);
    const jobData = await db.getJobById(jobId);
    socialHandler.postJobToSocialMedia(jobData);
    return;
  }
  res.sendStatus(404);
};

exports.removeJob = async (req, res) => {
  const { jobId } = req.params;
  const affectedRows = await db.deleteJob(jobId);
  if (affectedRows === 1) {
    res.status(200).send(true);
    return;
  }
  res.sendStatus(404);
};

exports.permitJobAdmin = async (req, res, next) => {
  const { id } = req.params;
  const { adminToken } = req.body;
  const jobData = await db.getJobById(id);
  if (jobData !== null) {
    const { job } = jobData;
    if (job.adminToken === adminToken) {
      next();
      return;
    }
  }
  res.sendStatus(500);
};
