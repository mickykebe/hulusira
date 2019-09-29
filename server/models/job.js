class Job ***REMOVED***
  constructor(
    id,
    position,
    jobType,
    companyId,
    tags,
    location,
    primaryTagId,
    monthlySalary,
    description,
    responsibilities,
    requirements,
    howToApply,
    applyUrl,
    applyEmail,
    created,
    approved,
    closed,
    slug,
    adminToken
  ) ***REMOVED***
    this.id = id;
    this.position = position;
    this.jobType = jobType;
    this.companyId = companyId;
    this.tags = tags;
    this.location = location;
    this.primaryTagId = primaryTagId;
    this.monthlySalary = monthlySalary;
    this.description = description;
    this.responsibilities = responsibilities;
    this.requirements = requirements;
    this.howToApply = howToApply;
    this.applyUrl = applyUrl;
    this.applyEmail = applyEmail;
    this.created = created;
    this.approved = approved;
    this.closed = closed;
    this.slug = slug;
    this.adminToken = adminToken;
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
      dbJob.job_company_id,
      tags,
      dbJob.job_location,
      dbJob.job_primary_tag,
      dbJob.job_monthly_salary,
      dbJob.job_description,
      dbJob.job_responsibilities,
      dbJob.job_requirements,
      dbJob.job_how_to_apply,
      dbJob.job_apply_url,
      dbJob.job_apply_email,
      dbJob.job_created,
      dbJob.job_approved,
      dbJob.job_closed,
      dbJob.job_slug,
      dbJob.job_admin_token
    );
  ***REMOVED***
***REMOVED***

module.exports = Job;
