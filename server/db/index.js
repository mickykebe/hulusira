const assert = require("assert");
const { Pool } = require("pg");
const { Company, Tag, Job, User } = require("../models");
const Knex = require("knex");
const slug = require("slug");

class Db {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DB_CONNECTION_STRING
    });
    this.knex = Knex({
      client: "pg",
      connection: process.env.DB_CONNECTION_STRING
    });
    this.jobColumns = [
      "id",
      "position",
      "job_type",
      "company_id",
      "city",
      "primary_tag",
      "monthly_salary",
      "description",
      "responsibilities",
      "requirements",
      "how_to_apply",
      "apply_url",
      "apply_email",
      "approved",
      "closed",
      "created",
      "slug"
    ];
    this.companyColumns = ["id", "name", "email", "logo", "verified"];
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

  jobSlug(id, position) {
    return `${id}-${slug(position)}`;
  }

  async createJob(jobData, companyId = null) {
    assert(!!jobData);

    if (jobData.primaryTagId) {
      const tagRows = await this.knex("tag")
        .select()
        .where("id", jobData.primaryTagId);
      if (tagRows.length === 0 || tagRows[0].is_primary === false) {
        throw new Error("Primary tag value set to invalid tag");
      }
    }

    const job = await this.knex.transaction(async trx => {
      const tags = await await Promise.all(
        jobData.tags.map(tagName => this.findOrCreateTag(tagName, { trx }))
      );

      let rows = await trx("job")
        .insert({
          position: jobData.position,
          job_type: jobData.jobType,
          company_id: companyId,
          city: jobData.city,
          primary_tag: jobData.primaryTagId,
          monthly_salary: jobData.monthlySalary,
          description: jobData.description,
          responsibilities: jobData.responsibilities,
          requirements: jobData.requirements,
          how_to_apply: jobData.howToApply,
          apply_url: jobData.applyUrl,
          apply_email: jobData.applyEmail
        })
        .returning(this.selectColumns("job", "job", this.jobColumns));

      if (rows.length !== 1) {
        throw new Error("Problem occurred inserting job");
      }
      const row = rows[0];

      rows = await trx("job")
        .where("id", row.job_id)
        .update({
          slug: this.jobSlug(row.job_id, row.job_position)
        })
        .returning(this.selectColumns("job", "job", this.jobColumns));

      const job = Job.fromDb(rows[0], tags);

      await Promise.all(
        tags.map(tag => this.createJobTag(job.id, tag.id, { trx }))
      );

      return job;
    });

    return job;

    /* const tags = await Promise.all(
      jobData.tags.map(tagName => this.findOrCreateTag(tagName))
    );

    let rows = await this.knex("job")
      .insert({
        position: jobData.position,
        job_type: jobData.jobType,
        company_id: companyId,
        city: jobData.city,
        primary_tag: jobData.primaryTagId,
        monthly_salary: jobData.monthlySalary,
        description: jobData.description,
        responsibilities: jobData.responsibilities,
        requirements: jobData.requirements,
        how_to_apply: jobData.howToApply,
        apply_url: jobData.applyUrl,
        apply_email: jobData.applyEmail
      })
      .returning(this.selectColumns("job", "job", this.jobColumns));

    if (rows.length !== 1) {
      throw new Error("Problem occurred inserting job");
    }
    const row = rows[0];

    rows = await this.knex("job")
      .where("id", row.job_id)
      .update({
        slug: this.jobSlug(row.job_id, row.job_position)
      })
      .returning(this.selectColumns("job", "job", this.jobColumns));

    const job = Job.fromDb(rows[0], tags);

    await Promise.all(tags.map(tag => this.createJobTag(job.id, tag.id)));

    return job; */
  }

  async createJobTag(jobId, tagId, { trx = null } = {}) {
    return (trx || this.knex)("job_tags").insert({
      job_id: jobId,
      tag_id: tagId
    });
  }

  async createCompany(companyData) {
    const rows = await this.knex("company")
      .insert({
        name: companyData.name,
        email: companyData.email,
        logo: companyData.logo
      })
      .returning(this.selectColumns("company", "company", this.companyColumns));
    return Company.fromDb(rows[0]);
  }

  async findOrCreateTag(name, { trx = null } = {}) {
    const res = await (trx || this.knex).raw(
      "with new_row as (insert into tag(name) select :name where not exists (select * from tag where name = :name) returning *) select * from new_row union select * from tag where name = :name",
      { name }
    );
    return Tag.fromDb(res.rows[0]);
  }

  /*   async findOrCreateTag(name) {
    const query =
      "with new_row as (insert into tag(name) select $1 where not exists (select * from tag where name=$1) returning *) select * from new_row union select * from tag where name=$1";
    const values = [name];
    const res = await this.pool.query(query, values);
    return Tag.fromDb(res.rows[0]);
  } */

  async getPrimaryTags() {
    const rows = this.knex("tag")
      .select()
      .where("is_primary", true)
      .orderBy("name");
    return rows.map(Tag.fromDb);
  }

  async getJobs({
    fromJobId,
    limit,
    closed = false,
    approved,
    withinDays
  } = {}) {
    let query = this.knex("job")
      .select(
        ...this.selectColumns("job", "job", this.jobColumns),
        ...this.selectColumns("company", "company", this.companyColumns)
      )
      .select(
        this.knex.raw(
          `coalesce(json_agg(json_build_object('id', tag.id, 'name', tag.name, 'isPrimary', tag.is_primary)) filter (where tag.id IS NOT NULL), '[]') as tags`
        )
      )
      .leftJoin("company", "job.company_id", "company.id")
      .leftJoin("job_tags", "job_tags.job_id", "job.id")
      .leftJoin("tag", "job_tags.tag_id", "tag.id")
      .where("job.closed", closed)
      .groupBy("job.id", "company.id")
      .orderBy("job.id", "desc");

    if (typeof fromJobId === "number") {
      query = query.andWhere("job.id", "<=", fromJobId);
    }
    if (typeof approved === "boolean") {
      query = query.andWhere("job.approved", approved);
    }
    if (typeof withinDays === "number") {
      query = query.andWhere(
        "job.created",
        ">=",
        this.knex.raw("NOW() - (?*'1 DAY'::INTERVAL)", [withinDays])
      );
    }
    if (typeof limit === "number") {
      query = query.limit(limit);
    }
    const rows = await query;
    return rows.map(row => {
      return {
        company: row.company_id && Company.fromDb(row),
        job: Job.fromDb(row, row.tags || [])
      };
    });
  }

  selectColumns(tableName, prefix, fields) {
    return fields.map(f => `${tableName}.${f} as ${prefix}_${f}`);
  }

  jobQuery() {
    return this.knex("job")
      .first(
        ...this.selectColumns("job", "job", this.jobColumns),
        ...this.selectColumns("company", "company", this.companyColumns)
      )
      .first(
        this.knex.raw(
          `coalesce(json_agg(json_build_object('id', extra_tags.id, 'name', extra_tags.name, 'isPrimary', extra_tags.is_primary)) filter (where extra_tags.id IS NOT NULL), '[]') as tags`
        )
      )
      .leftJoin("company", "job.company_id", "company.id")
      .leftJoin("job_tags", "job_tags.job_id", "job.id")
      .leftJoin(
        this.knex.raw("tag extra_tags on job_tags.tag_id = extra_tags.id")
      )
      .groupBy("job.id", "company.id");
  }

  async getJobBySlug(slug) {
    const row = await this.jobQuery().where("job.slug", slug);
    const company = row.company_id && Company.fromDb(row);
    return {
      company: company,
      job: Job.fromDb(row, row.tags || [])
    };
  }

  async getJobById(id) {
    const row = await this.jobQuery().where("job.id", id);
    const company = row.company_id && Company.fromDb(row);
    return {
      company: company,
      job: Job.fromDb(row, row.tags || [])
    };
  }

  async getUserByEmail(email) {
    const row = await this.knex("users")
      .first()
      .where("email", email);
    return User.fromDb(row);
  }

  async getUserById(id) {
    const row = await this.knex("users")
      .first()
      .where("id", id);
    return User.fromDb(row);
  }

  approveJob(id) {
    return this.knex("job")
      .where("id", id)
      .update({
        approved: true
      });
  }

  deleteJob(id) {
    return this.knex("job")
      .where("id", id)
      .del();
  }

  end() {
    return this.pool.end();
  }
}

module.exports = new Db();
