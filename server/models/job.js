class Job {
  constructor(
    id,
    position,
    jobType,
    companyId,
    tags,
    city,
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
    closed
  ) {
    this.id = id;
    this.position = position;
    this.jobType = jobType;
    this.companyId = companyId;
    this.tags = tags;
    this.city = city;
    this.primaryTagId = primaryTagId;
    this.monthlySalary = monthlySalary;
    this.description = description;
    this.responsibilities = responsibilities;
    this.requirements = requirements;
    this.howToApply = howToApply;
    this.applyUrl = applyUrl;
    this.applyEmail = applyEmail;
    this.created = created;
    this.approved = approved,
    this.closed = closed;
  }

  static fromDb(dbJob, tags) {
    return new Job(
      dbJob.job_id,
      dbJob.job_position,
      dbJob.job_job_type,
      dbJob.job_company_id,
      tags,
      dbJob.job_city,
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
    );
  }
}

module.exports = Job;
