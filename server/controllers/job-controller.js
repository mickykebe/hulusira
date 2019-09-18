const Yup = require("yup");
const db = require("../db/index");
const utils = require("../utils");

const validationSchema = Yup.object().shape(
  {
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
    description: Yup.string().required("Required"),
    applyUrl: Yup.string().when("applyEmail", {
      is: value => !value,
      then: Yup.string().required("Provide application URL or email")
    }),
    applyEmail: Yup.string()
      .email()
      .when("applyUrl", {
        is: value => !value,
        then: Yup.string()
          .email()
          .required("Provide application email or URL")
      }),
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
  },
  ["applyUrl", "applyEmail"]
);

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
  const resData = await db.createJobAndCompany({ company, job: jobData });
  res.status(200).send(resData);
};

exports.getPrimaryTags = async (req, res) => {
  const tags = await db.getPrimaryTags();
  res.status(200).send(tags);
};

exports.getJobs = async (req, res) => {
  let data;
  const { cursor: encodedCursor, count: countStr = "30" } = req.query;
  const fromJobId =
    typeof encodedCursor === "string" && encodedCursor !== ""
      ? parseInt(utils.base64decode(encodedCursor))
      : null;
  const count = parseInt(countStr);
  const jobs = await db.getJobs({
    fromJobId,
    limit: count + 1,
    approved: true,
    withinDays: 30
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
  const job = await db.getJobBySlug(slug);
  res.status(200).send(job);
};

exports.approveJob = async (req, res) => {
  const { jobId } = req.body;
  const affectedRows = await db.approveJob(jobId);
  if (affectedRows === 1) {
    res.status(200).send(true);
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
