const Yup = require("yup");
const db = require("../db/index");
const socialHandler = require("../handlers/social");
const utils = require("../utils");

const validationSchema = Yup.object().shape(
  ***REMOVED***
    position: Yup.string().required("Required"),
    jobType: Yup.string().required("Required"),
    primaryTag: Yup.string()
      .nullable()
      .test(
        "primaryTag-required",
        "Choose at least one tag here or enter a tag in the Extra Tags input below.",
        function(value) ***REMOVED***
          const tags = this.parent.tags;
          if (!tags || tags.length === 0) ***REMOVED***
            return !!value;
          ***REMOVED***
          return true;
        ***REMOVED***
      ),
    tags: Yup.array().test(
      "tags-required",
      "Please enter at least one tag here or choose a tag in the Primary Tag input above.",
      function(value) ***REMOVED***
        const ***REMOVED*** primaryTag ***REMOVED*** = this.parent;
        if (primaryTag === null || primaryTag === undefined) ***REMOVED***
          return value && value.length > 0;
        ***REMOVED***
        return true;
      ***REMOVED***
    ),
    deadline: Yup.date()
      .nullable()
      .default(null),
    description: Yup.string().required("Required"),
    applyEmail: Yup.string()
      .nullable()
      .notRequired()
      .email(),
    companyName: Yup.string().when(["hasCompany", "companyId"], ***REMOVED***
      is: (hasCompany, companyId) => hasCompany && !companyId,
      then: Yup.string().required("Required")
    ***REMOVED***),
    companyEmail: Yup.string().when(["hasCompany", "companyId"], ***REMOVED***
      is: (hasCompany, companyId) => hasCompany && !companyId,
      then: Yup.string()
        .email()
        .required("Required")
    ***REMOVED***),
    companyId: Yup.number()
      .nullable()
      .when(["hasCompany", "companyName"], ***REMOVED***
        is: (hasCompany, companyName) => hasCompany && !companyName,
        then: Yup.number().required("Required")
      ***REMOVED***)
  ***REMOVED***,
  ["companyId", "companyName"]
);

exports.validateJobPost = async (req, res, next) => ***REMOVED***
  const jobData = req.body;
  try ***REMOVED***
    await validationSchema.validate(jobData, ***REMOVED*** abortEarly: false ***REMOVED***);
  ***REMOVED*** catch (error) ***REMOVED***
    res.status(500).send(***REMOVED*** error: error.inner ***REMOVED***);
    return;
  ***REMOVED***
  next();
***REMOVED***;

exports.editJob = async (req, res) => ***REMOVED***
  const ***REMOVED*** id ***REMOVED*** = req.params;
  const data = req.body;
  const ***REMOVED*** hasCompany, ...jobData ***REMOVED*** = data;
  const count = await db.jobCount(***REMOVED*** id, owner: req.user.id ***REMOVED***);
  if (count !== 1) ***REMOVED***
    throw new Error("Job unavailable");
  ***REMOVED***

  if (!hasCompany) ***REMOVED***
    jobData.companyId = null;
  ***REMOVED***

  if (jobData.companyId) ***REMOVED***
    const company = await db.getCompany(jobData.companyId, req.user.id);
    if (!company) ***REMOVED***
      throw new Error("Company not found");
    ***REMOVED***
  ***REMOVED***

  const job = await db.updateJob(id, jobData);
  res.status(200).send(job);
***REMOVED***;

exports.createJob = async (req, res) => ***REMOVED***
  const data = req.body;
  const ***REMOVED***
    hasCompany,
    companyName,
    companyEmail,
    companyLogo,
    companyId,
    ...jobData
  ***REMOVED*** = data;
  const isAdminUser = req.user && req.user.role === "admin";
  if (req.user) ***REMOVED***
    jobData.owner = req.user.id;
  ***REMOVED***
  if (isAdminUser) ***REMOVED***
    jobData.approvalStatus = "Active";
  ***REMOVED***
  let resData;
  if (hasCompany) ***REMOVED***
    if (companyId) ***REMOVED***
      const company = await db.getCompany(companyId, req.user.id);
      if (!company) ***REMOVED***
        throw new Error("Company not found");
      ***REMOVED***
      const job = await db.createJob(jobData, companyId);
      resData = ***REMOVED*** job, company ***REMOVED***;
    ***REMOVED*** else ***REMOVED***
      const company = ***REMOVED***
        name: companyName,
        email: companyEmail,
        logo: companyLogo
      ***REMOVED***;
      if (req.user) ***REMOVED***
        company.owner = req.user.id;
      ***REMOVED***
      resData = await db.createJobAndCompany(***REMOVED*** company, job: jobData ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** else ***REMOVED***
    const job = await db.createJob(jobData);
    resData = ***REMOVED*** job, company: null ***REMOVED***;
  ***REMOVED***
  if (isAdminUser) ***REMOVED***
    socialHandler.postJobToSocialMedia(resData);
  ***REMOVED***
  res.status(200).send(resData);
***REMOVED***;

exports.getPrimaryTags = async (req, res) => ***REMOVED***
  const tags = await db.getPrimaryTags();
  res.status(200).send(tags);
***REMOVED***;

exports.getJobs = async (req, res) => ***REMOVED***
  let data;
  const ***REMOVED***
    cursor: encodedCursor,
    count: countStr = "30",
    tags = ""
  ***REMOVED*** = req.query;
  const fromJobId =
    typeof encodedCursor === "string" && encodedCursor !== ""
      ? parseInt(utils.base64decode(encodedCursor))
      : null;
  const count = parseInt(countStr);
  const tagNames = utils.tagNamesFromQueryParam(tags);
  const jobs = await db.getJobs(***REMOVED***
    fromJobId,
    limit: count + 1,
    approvalStatus: ["Active", "Closed"],
    withinDays: 30,
    tagNames,
    publicOnly: true
  ***REMOVED***);
  if (jobs.length < count + 1) ***REMOVED***
    data = ***REMOVED*** jobs, nextCursor: "" ***REMOVED***;
  ***REMOVED*** else ***REMOVED***
    data = ***REMOVED***
      jobs: jobs.slice(0, -1),
      nextCursor: utils.base64encode(String(jobs[count].job.id))
    ***REMOVED***;
  ***REMOVED***
  res.status(200).send(data);
***REMOVED***;

exports.companyJobs = async function(req, res) ***REMOVED***
  const ***REMOVED*** id ***REMOVED*** = req.params;
  const companyCount = await db.companyCount(id);
  if (companyCount !== 1) ***REMOVED***
    res.sendStatus(404);
    return;
  ***REMOVED***

  try ***REMOVED***
    const jobs = await db.getJobs(***REMOVED***
      approvalStatus: ["Active", "Closed"],
      withinDays: 30,
      publicOnly: true,
      companyId: id
    ***REMOVED***);
    res.status(200).send(jobs);
  ***REMOVED*** catch (err) ***REMOVED***
    console.error(err);
  ***REMOVED***
***REMOVED***;

exports.myJobs = async (req, res) => ***REMOVED***
  const ownerId = req.user.id;
  if (!ownerId) ***REMOVED***
    throw new Error("Not logged in");
  ***REMOVED***
  const jobs = await db.getJobs(***REMOVED***
    approvalStatus: ["Active", "Pending", "Declined"],
    ownerId,
    withinDays: 30
  ***REMOVED***);
  res.status(200).send(jobs);
***REMOVED***;

exports.pendingJobs = async (_, res) => ***REMOVED***
  const jobs = await db.getJobs(***REMOVED*** approvalStatus: "Pending" ***REMOVED***);
  res.status(200).send(jobs);
***REMOVED***;

function publicCompany(company) ***REMOVED***
  const ***REMOVED*** owner, ...companyData ***REMOVED*** = company;
  return companyData;
***REMOVED***

exports.getJob = async (req, res) => ***REMOVED***
  const ***REMOVED*** slug ***REMOVED*** = req.params;
  const jobData = await db.getJobBySlug(slug);
  if (jobData === null) ***REMOVED***
    res.sendStatus(404);
    return;
  ***REMOVED***
  const ***REMOVED*** adminToken ***REMOVED*** = req.query;
  let hasAdminPermission = false;

  if (req.user) ***REMOVED***
    hasAdminPermission =
      req.user.role === "admin" || req.user.id === jobData.job.owner;
  ***REMOVED*** else if (adminToken) ***REMOVED***
    hasAdminPermission = jobData.job.adminToken === adminToken;
  ***REMOVED***

  if (!hasAdminPermission) ***REMOVED***
    jobData.job = jobData.job.publicData();
    if (jobData.company) ***REMOVED***
      jobData.company = publicCompany(jobData.company);
    ***REMOVED***
  ***REMOVED***

  const ***REMOVED*** approvalStatus ***REMOVED*** = jobData.job;
  if (
    (approvalStatus === "Declined" || approvalStatus === "Pending") &&
    !hasAdminPermission
  ) ***REMOVED***
    res.sendStatus(404);
    return;
  ***REMOVED***
  res.status(200).send(jobData);
***REMOVED***;

exports.closeJob = async (req, res) => ***REMOVED***
  const ***REMOVED*** id ***REMOVED*** = req.params;
  const affectedRows = await db.closeJob(id);
  if (affectedRows === 1) ***REMOVED***
    res.status(200).send(true);
    const jobData = await db.getJobById(id);
    await socialHandler.postJobCloseToSocialMedia(jobData);
    db.deleteJobSocialPost(id);
    return;
  ***REMOVED***
  res.sendStatus(404);
***REMOVED***;

exports.approveJob = async (req, res) => ***REMOVED***
  const ***REMOVED*** jobId ***REMOVED*** = req.body;
  const affectedRows = await db.approveJob(jobId);
  if (affectedRows === 1) ***REMOVED***
    res.status(200).send(true);
    const jobData = await db.getJobById(jobId);
    socialHandler.postJobToSocialMedia(jobData);
    return;
  ***REMOVED***
  res.sendStatus(404);
***REMOVED***;

exports.declineJob = async (req, res) => ***REMOVED***
  const ***REMOVED*** id ***REMOVED*** = req.params;
  const affectedRows = await db.declineJob(id);
  if (affectedRows === 1) ***REMOVED***
    res.status(200).send(true);
    return;
  ***REMOVED***
  res.sendStatus(404);
***REMOVED***;

exports.removeJob = async (req, res) => ***REMOVED***
  const ***REMOVED*** jobId ***REMOVED*** = req.params;
  const affectedRows = await db.deleteJob(jobId);
  if (affectedRows === 1) ***REMOVED***
    res.status(200).send(true);
    return;
  ***REMOVED***
  res.sendStatus(404);
***REMOVED***;

exports.permitJobAdmin = async (req, res, next) => ***REMOVED***
  const ***REMOVED*** id ***REMOVED*** = req.params;
  const ***REMOVED*** adminToken ***REMOVED*** = req.body;
  const jobData = await db.getJobById(id);
  if (jobData !== null) ***REMOVED***
    const ***REMOVED*** job ***REMOVED*** = jobData;
    if (
      (adminToken && job.adminToken === adminToken) ||
      (req.user && req.user.id === job.owner)
    ) ***REMOVED***
      next();
      return;
    ***REMOVED***
  ***REMOVED***
  res.sendStatus(500);
***REMOVED***;
