const Yup = require("yup");
const db = require("../db/index");
const socialHandler = require("../handlers/social");
const utils = require("../utils");
const validation = require("../utils/validation");
const jobHandler = require("../handlers/jobHandler");
const telegramBot = require("../telegram_bot");

const validationSchema = Yup.object().shape(
  {
    position: validation.positionValidator,
    jobType: validation.jobTypeValidator,
    careerLevel: validation.careerLevelValidator,
    primaryTag: Yup.string()
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
        const { primaryTag } = this.parent;
        if (primaryTag === null || primaryTag === undefined) {
          return value && value.length > 0;
        }
        return true;
      }
    ),
    deadline: validation.deadlineValidator,
    description: validation.descriptionValidator,
    applyEmail: validation.applyEmailValidator,
    companyName: Yup.string().when(["hasCompany", "companyId"], {
      is: (hasCompany, companyId) => hasCompany && !companyId,
      then: validation.companyNameValidator
    }),
    companyEmail: Yup.string().when(["hasCompany", "companyId"], {
      is: (hasCompany, companyId) => hasCompany && !companyId,
      then: validation.companyEmailValidator
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
  const resData = await jobHandler.createJob(req.user, req.body);
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
    count: countStr = "50",
    tags = [],
    jobTypes = [],
    careerLevels = []
  } = req.query;
  const fromJobId =
    typeof encodedCursor === "string" && encodedCursor !== ""
      ? parseInt(utils.base64decode(encodedCursor))
      : null;
  const count = parseInt(countStr);
  const jobs = await db.getJobs({
    fromJobId,
    limit: count + 1,
    approvalStatus: ["Active", "Closed"],
    withinDays: 30,
    tagNames: tags,
    jobTypes: jobTypes,
    careerLevels: careerLevels,
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

exports.companyJobs = async function(req, res) {
  const { id } = req.params;
  const companyCount = await db.companyCount(id);
  if (companyCount !== 1) {
    res.sendStatus(404);
    return;
  }

  try {
    const jobs = await db.getJobs({
      approvalStatus: ["Active", "Closed"],
      withinDays: 30,
      publicOnly: true,
      companyId: id
    });
    res.status(200).send(jobs);
  } catch (err) {
    console.error(err);
  }
};

exports.myJobs = async (req, res) => {
  const ownerId = req.user.id;
  if (!ownerId) {
    throw new Error("Not logged in");
  }
  const jobs = await db.getJobs({
    approvalStatus: ["Active", "Pending", "Declined"],
    ownerId,
    withinDays: 30
  });
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

  const { approvalStatus } = jobData.job;
  if (
    (approvalStatus === "Declined" || approvalStatus === "Pending") &&
    !hasAdminPermission
  ) {
    res.sendStatus(404);
    return;
  }
  res.status(200).send(jobData);
};

exports.openPage = async (req, res) => {
  const { slug } = req.params;
  await db.incrementJobView({ slug });
  res.sendStatus(200);
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
    if (jobData.job.owner) {
      const owner = await db.getUserById(jobData.job.owner);
      if (owner.telegramId || owner.telegramUserName) {
        await telegramBot.sendMessage(
          owner.telegramId || owner.telegramUserName,
          `🙌🙌🙌Your job listing has been approved 🙌🙌🙌.
It's been shared on Hulusira's telegram channel and facebook page.

You can find the job here: ${utils.jobUrlFromSlug(jobData.job.slug)}`
        );
      }
    }
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
    if (
      (adminToken && job.adminToken === adminToken) ||
      (req.user && req.user.id === job.owner)
    ) {
      next();
      return;
    }
  }
  res.sendStatus(500);
};
