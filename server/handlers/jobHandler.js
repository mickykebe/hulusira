const db = require("../db");
const socialHandler = require("../handlers/social");

exports.createJob = async (user, data) => ***REMOVED***
  const ***REMOVED***
    companyName,
    companyEmail,
    companyLogo,
    companyId,
    ...jobData
  ***REMOVED*** = data;
  const isAdminUser = user && user.role === "admin";
  if (user) ***REMOVED***
    jobData.owner = user.id;
  ***REMOVED***
  if (isAdminUser) ***REMOVED***
    jobData.approvalStatus = "Active";
  ***REMOVED***
  let resData;
  if (companyId) ***REMOVED***
    const company = await db.getCompany(companyId, user.id);
    if (!company) ***REMOVED***
      throw new Error("Company not found");
    ***REMOVED***
    const job = await db.createJob(jobData, companyId);
    resData = ***REMOVED*** job, company ***REMOVED***;
  ***REMOVED*** else if (companyName && companyEmail) ***REMOVED***
    const company = ***REMOVED***
      name: companyName,
      email: companyEmail,
      logo: companyLogo
    ***REMOVED***;
    if (user) ***REMOVED***
      company.owner = user.id;
    ***REMOVED***
    resData = await db.createJobAndCompany(***REMOVED*** company, job: jobData ***REMOVED***);
  ***REMOVED*** else ***REMOVED***
    const job = await db.createJob(jobData);
    resData = ***REMOVED*** job, company: null ***REMOVED***;
  ***REMOVED***
  if (isAdminUser) ***REMOVED***
    socialHandler.postJobToSocialMedia(resData);
  ***REMOVED***
  return resData;
***REMOVED***;
