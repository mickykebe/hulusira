const Yup = require("yup");
const db = require("../db/index");
const socialHandler = require("../handlers/social");
const utils = require("../utils");

const validationSchema = Yup.object().shape(***REMOVED***
  position: Yup.string().required("Required"),
  jobType: Yup.string().required("Required"),
  primaryTagId: Yup.number()
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
      const ***REMOVED*** primaryTagId ***REMOVED*** = this.parent;
      if (primaryTagId === null || primaryTagId === undefined) ***REMOVED***
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
  companyName: Yup.string().when("hasCompany", ***REMOVED***
    is: true,
    then: Yup.string().required("Required")
  ***REMOVED***),
  companyEmail: Yup.string().when("hasCompany", ***REMOVED***
    is: true,
    then: Yup.string()
      .email()
      .required("Required")
  ***REMOVED***)
***REMOVED***);

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

exports.createJob = async (req, res) => ***REMOVED***
  const data = req.body;
  const ***REMOVED***
    hasCompany,
    companyName,
    companyEmail,
    companyLogo,
    ...jobData
  ***REMOVED*** = data;
  let company = null;
  if (hasCompany) ***REMOVED***
    company = ***REMOVED***
      name: companyName,
      email: companyEmail,
      logo: companyLogo
    ***REMOVED***;
  ***REMOVED***
  const isAdminUser = req.user && req.user.role === "admin";
  if (isAdminUser) ***REMOVED***
    jobData.approved = true;
  ***REMOVED***
  const resData = await db.createJobAndCompany(***REMOVED*** company, job: jobData ***REMOVED***);
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
  const tagIds = utils.tagIdsfromQueryParam(tags);
  const jobs = await db.getJobs(***REMOVED***
    fromJobId,
    limit: count + 1,
    approved: true,
    withinDays: 30,
    tagIds,
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

exports.pendingJobs = async (_, res) => ***REMOVED***
  const jobs = await db.getJobs(***REMOVED*** approved: false ***REMOVED***);
  res.status(200).send(jobs);
***REMOVED***;

exports.getJob = async (req, res) => ***REMOVED***
  const ***REMOVED*** slug ***REMOVED*** = req.params;
  const jobData = await db.getJobBySlug(slug);
  if (jobData === null) ***REMOVED***
    res.sendStatus(404);
    return;
  ***REMOVED***
  const ***REMOVED*** adminToken ***REMOVED*** = req.query;
  const isJobAdmin = !!adminToken && jobData.job.adminToken === adminToken;

  if (!isJobAdmin) ***REMOVED***
    jobData.job = jobData.job.publicData();
  ***REMOVED***

  if ((jobData.job.closed || !jobData.job.approved) && !isJobAdmin) ***REMOVED***
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
    if (job.adminToken === adminToken) ***REMOVED***
      next();
      return;
    ***REMOVED***
  ***REMOVED***
  res.sendStatus(500);
***REMOVED***;
