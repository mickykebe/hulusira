class Job {
  constructor(
    id,
    position,
    jobType,
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
    closed,
    slug,
    adminToken,
    deadline
  ) {
    this.id = id;
    this.position = position;
    this.jobType = jobType;
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
    this.closed = closed;
    this.slug = slug;
    this.adminToken = adminToken;
    this.deadline = deadline;
  }

  publicData() {
    const { adminToken, ...data } = this;
    return data;
  }

  static fromDb(dbJob, tags) {
    return new Job(
      dbJob.job_id,
      dbJob.job_position,
      dbJob.job_job_type,
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
      dbJob.job_closed,
      dbJob.job_slug,
      dbJob.job_admin_token,
      dbJob.job_deadline
    );
  }
}

module.exports = Job;
