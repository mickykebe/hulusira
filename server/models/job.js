class Job ***REMOVED***
  constructor(
    id,
    position,
    jobType,
    careerLevel,
    companyId,
    tags,
    location,
    primaryTagId,
    salary,
    description,
    responsibilities,
    requirements,
    howToApply,
    applyUrl,
    applyEmail,
    created,
    approvalStatus,
    slug,
    adminToken,
    deadline,
    owner,
    views
  ) ***REMOVED***
    this.id = id;
    this.position = position;
    this.jobType = jobType;
    this.careerLevel = careerLevel;
    this.companyId = companyId;
    this.tags = tags;
    this.location = location;
    this.primaryTagId = primaryTagId;
    this.salary = salary;
    this.description = description;
    this.responsibilities = responsibilities;
    this.requirements = requirements;
    this.howToApply = howToApply;
    this.applyUrl = applyUrl;
    this.applyEmail = applyEmail;
    this.created = created;
    this.approvalStatus = approvalStatus;
    this.slug = slug;
    this.adminToken = adminToken;
    this.deadline = deadline;
    this.owner = owner;
    this.views = views;
  ***REMOVED***

  publicData() ***REMOVED***
    const ***REMOVED*** adminToken, ...data ***REMOVED*** = this;
    return data;
  ***REMOVED***

  static fromDb(dbJob, tags) ***REMOVED***
    return new Job(
      dbJob.job_id,
      dbJob.job_position,
      dbJob.job_job_type,
      dbJob.job_career_level,
      dbJob.job_company_id,
      tags,
      dbJob.job_location,
      dbJob.job_primary_tag,
      dbJob.job_salary,
      dbJob.job_description,
      dbJob.job_responsibilities,
      dbJob.job_requirements,
      dbJob.job_how_to_apply,
      dbJob.job_apply_url,
      dbJob.job_apply_email,
      dbJob.job_created,
      dbJob.job_approval_status,
      dbJob.job_slug,
      dbJob.job_admin_token,
      dbJob.job_deadline,
      dbJob.job_owner,
      dbJob.job_views
    );
  ***REMOVED***
***REMOVED***

module.exports = Job;
