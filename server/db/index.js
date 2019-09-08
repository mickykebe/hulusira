const assert = require("assert");
const { Pool } = require("pg");
const { Company, Tag, Job, User } = require("../models");

class Db {
  constructor(pool) {
    this.pool = pool;
  }

  async createJobAndCompany({ company: companyData, job: jobData }) {
    let company = null;

    if (companyData) {
      company = await this.createCompany(companyData);
    }

    const job = await this.createJob(jobData, company && company.id);
    return {
      company,
      job
    };
  }

  async createJob(jobData, companyId = null) {
    assert(!!jobData);

    if (jobData.primaryTagId) {
      const tagRes = await this.pool.query(`SELECT * FROM tag WHERE id = $1`, [
        jobData.primaryTagId
      ]);
      if (tagRes.rows.length === 0 || tagRes.rows[0].is_primary === false) {
        throw new Error("Primary tag value set to invalid tag");
      }
    }

    const tags = await Promise.all(
      jobData.tags.map(tagName => this.findOrCreateTag(tagName))
    );

    const query = `INSERT INTO job(position, job_type, company_id, city, primary_tag, monthly_salary, description, responsibilities, requirements, how_to_apply, apply_url, apply_email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`;
    const values = [
      jobData.position,
      jobData.jobType,
      companyId,
      jobData.city,
      jobData.primaryTagId,
      jobData.monthlySalary,
      jobData.description,
      jobData.responsibilities,
      jobData.requirements,
      jobData.howToApply,
      jobData.applyUrl,
      jobData.applyEmail
    ];

    const res = await this.pool.query(query, values);
    const job = Job.fromDb(res.rows[0], tags);

    await Promise.all(tags.map(tag => this.createJobTag(job.id, tag.id)));

    return job;
  }

  async createJobTag(jobId, tagId) {
    const query = `INSERT INTO job_tags(job_id, tag_id) VALUES ($1, $2) RETURNING *`;
    const values = [jobId, tagId];

    return this.pool.query(query, values);
  }

  async createCompany(companyData) {
    const query = `INSERT INTO company(name, email, logo) VALUES ($1, $2, $3) RETURNING *`;
    const values = [companyData.name, companyData.email, companyData.logo];
    const res = await this.pool.query(query, values);
    return Company.fromDb(res.rows[0]);
  }

  async findOrCreateTag(name) {
    const query =
      "with new_row as (insert into tag(name) select $1 where not exists (select * from tag where name=$1) returning *) select * from new_row union select * from tag where name=$1";
    const values = [name];
    const res = await this.pool.query(query, values);
    return Tag.fromDb(res.rows[0]);
  }

  async getPrimaryTags() {
    const query = `SELECT * FROM tag WHERE is_primary = TRUE ORDER BY name`;
    const res = await this.pool.query(query);
    return res.rows.map(Tag.fromDb);
  }

  _jobFromRow(row) {
    const company =
      row.company_id &&
      new Company(
        row.company_id,
        row.company_name,
        row.company_email,
        row.company_logo
      );
    return {
      company: company,
      job: Job.fromDb(row, row.tags || [])
    };
  }

  async getJobs(fromJobId = -1, limit = 30) {
    const query = `SELECT job.*, job.position, company.id as company_id, company.name as company_name, company.email as company_email, company.logo as company_logo, company.verified as company_verified, coalesce(json_agg(json_build_object('id', extra_tags.id, 'name', extra_tags.name, 'isPrimary', extra_tags.is_primary)) filter (where extra_tags.id IS NOT NULL), '[]') as tags from job left join company on job.company_id = company.id left join job_tags on job_tags.job_id = job.id left join tag extra_tags on job_tags.tag_id = extra_tags.id ${
      fromJobId !== -1 ? "where job.id <= $2" : ""
    } group by job.id, company.id order by job.id desc limit $1;`;
    const values = [limit, ...(fromJobId !== -1 ? [fromJobId] : [])];
    const res = await this.pool.query(query, values);
    const jobsData = res.rows.map(this._jobFromRow);
    return jobsData;
  }

  async getJobById(id) {
    const query =
      "SELECT job.*, job.position, company.id as company_id, company.name as company_name, company.email as company_email, company.logo as company_logo, company.verified as company_verified, coalesce(json_agg(json_build_object('id', extra_tags.id, 'name', extra_tags.name, 'isPrimary', extra_tags.is_primary)) filter (where extra_tags.id IS NOT NULL), '[]') as tags from job left join company on job.company_id = company.id left join job_tags on job_tags.job_id = job.id left join tag extra_tags on job_tags.tag_id = extra_tags.id where job.id = $1 group by job.id, company.id;";
    const res = await this.pool.query(query, [id]);
    if (res.rowCount === 0) {
      throw new Error("Resource not found");
    }
    if (res.rowCount > 1) {
      throw new Error("Data integrity constraint violation");
    }
    return this._jobFromRow(res.rows[0]);
  }

  _getUserFromDbRes(res) {
    if (res.rowCount === 0) {
      return null;
    }
    if (res.rowCount > 1) {
      throw new Error("Data integrity constraint violation");
    }

    return User.fromDb(res.rows[0]);
  }

  async getUserByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const res = await this.pool.query(query, [email]);
    return this._getUserFromDbRes(res);
  }

  async getUserById(id) {
    const query = "SELECT * FROM users WHERE id = $1";
    const res = await this.pool.query(query, [id]);
    return this._getUserFromDbRes(res);
  }

  end() {
    return this.pool.end();
  }
}

module.exports = new Db(
  new Pool({
    connectionString: process.env.DB_CONNECTION_STRING
  })
);
