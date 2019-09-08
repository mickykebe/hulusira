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
    created
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
  }

  static fromDb(dbJob, tags) {
    return new Job(
      dbJob.id,
      dbJob.position,
      dbJob.job_type,
      dbJob.company_id,
      tags,
      dbJob.city,
      dbJob.primary_tag,
      dbJob.monthly_salary,
      dbJob.description,
      dbJob.responsibilities,
      dbJob.requirements,
      dbJob.how_to_apply,
      dbJob.apply_url,
      dbJob.apply_email,
      dbJob.created
    );
  }
}

module.exports = Job;
