const Yup = require("yup");
const db = require("../db/index");
const utils = require("../utils");

const validationSchema = Yup.object().shape(
  ***REMOVED***
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
    description: Yup.string().required("Required"),
    applyUrl: Yup.string().when("applyEmail", ***REMOVED***
      is: value => !value,
      then: Yup.string().required("Provide application URL or email")
    ***REMOVED***),
    applyEmail: Yup.string()
      .email()
      .when("applyUrl", ***REMOVED***
        is: value => !value,
        then: Yup.string()
          .email()
          .required("Provide application email or URL")
      ***REMOVED***),
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
  ***REMOVED***,
  ["applyUrl", "applyEmail"]
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
  const resData = await db.createJobAndCompany(***REMOVED*** company, job: jobData ***REMOVED***);
  res.status(200).send(resData);
***REMOVED***;

exports.getPrimaryTags = async (req, res) => ***REMOVED***
  const tags = await db.getPrimaryTags();
  res.status(200).send(tags);
***REMOVED***;

exports.getJobs = async (req, res) => ***REMOVED***
  let data;
  const ***REMOVED*** cursor: encodedCursor, count: countStr = "30" ***REMOVED*** = req.query;
  const fromJobId =
    typeof encodedCursor === "string" && encodedCursor !== ""
      ? parseInt(utils.base64decode(encodedCursor))
      : null;
  const count = parseInt(countStr);
  const jobs = await db.getJobs(***REMOVED***
    fromJobId,
    limit: count + 1,
    approved: true,
    withinDays: 30
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
  const job = await db.getJobBySlug(slug);
  res.status(200).send(job);
***REMOVED***;

exports.approveJob = async (req, res) => ***REMOVED***
  const ***REMOVED*** jobId ***REMOVED*** = req.body;
  const affectedRows = await db.approveJob(jobId);
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
