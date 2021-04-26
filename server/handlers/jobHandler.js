const db = require("../db");
const socialHandler = require("../handlers/social");

exports.createJob = async (user, data) => {
  const {
    companyName,
    companyEmail,
    companyLogo,
    companyId,
    postToFacebook = false,
    socialPostScheduleTime,
    ...jobData
  } = data;
  const isAdminUser = user && user.role === "admin";
  if (user) {
    jobData.owner = user.id;
  }
  if (isAdminUser) {
    jobData.approvalStatus = "Active";
  }
  let resData;
  if (companyId) {
    const company = await db.getCompany(companyId, user.id);
    if (!company) {
      throw new Error("Company not found");
    }
    const job = await db.createJob(jobData, companyId);
    resData = { job, company };
  } else if (companyName && companyEmail) {
    const company = {
      name: companyName,
      email: companyEmail,
      logo: companyLogo,
    };
    if (user) {
      company.owner = user.id;
    }
    resData = await db.createJobAndCompany({ company, job: jobData });
  } else {
    const job = await db.createJob(jobData);
    resData = { job, company: null };
  }
  if (isAdminUser && postToFacebook) {
    socialHandler.postJobToSocialMedia(resData, {
      fbSchedule: socialPostScheduleTime,
    });
  }
  return resData;
};
