const Yup = require("yup");
const db = require("../db/index");
const socialHandler = require("../handlers/social");
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
    deadline: Yup.date()
      .nullable()
      .default(null),
    description: Yup.string().required("Required"),
    applyEmail: Yup.string()
      .nullable()
      .notRequired()
      .email(),
    companyName: Yup.string().when(["hasCompany", "companyId"], {
      is: (hasCompany, companyId) => hasCompany && !companyId,
      then: Yup.string().required("Required")
    }),
    companyEmail: Yup.string().when(["hasCompany", "companyId"], {
      is: (hasCompany, companyId) => hasCompany && !companyId,
      then: Yup.string()
        .email()
        .required("Required")
    }),
    companyId: Yup.number()
      .nullable()
      .when(["hasCompany", "companyName"], {
        is: (hasCompany, companyName) => hasCompany && !companyName,
        then: Yup.number().required("Required")
      })
  },
  ["companyId", "companyName"]
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

exports.editJob = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const { hasCompany, ...jobData } = data;
  const count = await db.jobCount({ id, owner: req.user.id });
  if (count !== 1) {
    throw new Error("Job unavailable");
  }

  if (!hasCompany) {
    jobData.companyId = null;
  }

  if (jobData.companyId) {
    const company = await db.getCompany(jobData.companyId, req.user.id);
    if (!company) {
      throw new Error("Company not found");
    }
  }

  const job = await db.updateJob(id, jobData);
  res.status(200).send(job);
};

exports.createJob = async (req, res) => {
  const data = req.body;
  const {
    hasCompany,
    companyName,
    companyEmail,
    companyLogo,
    companyId,
    ...jobData
  } = data;
  const isAdminUser = req.user && req.user.role === "admin";
  if (req.user) {
    jobData.owner = req.user.id;
  }
  if (isAdminUser) {
    jobData.approvalStatus = "Approved";
  }
  let resData;
  if (hasCompany) {
    if (companyId) {
      const company = await db.getCompany(companyId, req.user.id);
      if (!company) {
        throw new Error("Company not found");
      }
      const job = await db.createJob(jobData, companyId);
      resData = { job, company };
    } else {
      const company = {
        name: companyName,
        email: companyEmail,
        logo: companyLogo
      };
      if (req.user) {
        company.owner = req.user.id;
      }
      resData = await db.createJobAndCompany({ company, job: jobData });
    }
  }
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
    approvalStatus: "Approved",
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

exports.myJobs = async (req, res) => {
  const ownerId = req.user.id;
  if (!ownerId) {
    throw new Error("Not logged in");
  }
  const jobs = await db.getJobs({ ownerId });
  res.status(200).send(jobs);
};

exports.pendingJobs = async (_, res) => {
  const jobs = await db.getJobs({ approvalStatus: "Pending" });
  res.status(200).send(jobs);
};

function publicCompany(company) {
  const { owner, ...companyData } = company;
  return companyData;
}

exports.getJob = async (req, res) => {
  const { slug } = req.params;
  const jobData = await db.getJobBySlug(slug);
  if (jobData === null) {
    res.sendStatus(404);
    return;
  }
  const { adminToken } = req.query;
  let hasAdminPermission = false;

  if (req.user) {
    hasAdminPermission =
      req.user.role === "admin" || req.user.id === jobData.job.owner;
  } else if (adminToken) {
    hasAdminPermission = jobData.job.adminToken === adminToken;
  }

  if (!hasAdminPermission) {
    jobData.job = jobData.job.publicData();
    if (jobData.company) {
      jobData.company = publicCompany(jobData.company);
    }
  }

  if (
    (jobData.job.closed || jobData.job.approvalStatus !== "Approved") &&
    !hasAdminPermission
  ) {
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

exports.declineJob = async (req, res) => {
  const { id } = req.params;
  const affectedRows = await db.declineJob(id);
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
