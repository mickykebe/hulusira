const assert = require("assert");
const ***REMOVED*** Pool ***REMOVED*** = require("pg");
const ***REMOVED*** Company, Tag, Job, User ***REMOVED*** = require("../models");
const Knex = require("knex");
const slug = require("slug");

class Db ***REMOVED***
  constructor() ***REMOVED***
    this.pool = new Pool(***REMOVED***
      connectionString: process.env.DB_CONNECTION_STRING
    ***REMOVED***);
    this.knex = Knex(***REMOVED***
      client: "pg",
      connection: process.env.DB_CONNECTION_STRING
    ***REMOVED***);
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
      "slug",
      "admin_token"
    ];
    this.companyColumns = ["id", "name", "email", "logo", "verified"];
  ***REMOVED***

  async createJobAndCompany(***REMOVED*** company: companyData, job: jobData ***REMOVED***) ***REMOVED***
    let company = null;

    if (companyData) ***REMOVED***
      company = await this.createCompany(companyData);
    ***REMOVED***

    const job = await this.createJob(jobData, company && company.id);
    return ***REMOVED***
      company,
      job
    ***REMOVED***;
  ***REMOVED***

  jobSlug(id, position) ***REMOVED***
    return `$***REMOVED***id***REMOVED***-$***REMOVED***slug(position)***REMOVED***`;
  ***REMOVED***

  async createJob(jobData, companyId = null) ***REMOVED***
    assert(!!jobData);

    if (jobData.primaryTagId) ***REMOVED***
      const tagRows = await this.knex("tag")
        .select()
        .where("id", jobData.primaryTagId);
      if (tagRows.length === 0 || tagRows[0].is_primary === false) ***REMOVED***
        throw new Error("Primary tag value set to invalid tag");
      ***REMOVED***
    ***REMOVED***

    const job = await this.knex.transaction(async trx => ***REMOVED***
      const tags = await await Promise.all(
        jobData.tags.map(tagName => this.findOrCreateTag(tagName, ***REMOVED*** trx ***REMOVED***))
      );

      let rows = await trx("job")
        .insert(***REMOVED***
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
        ***REMOVED***)
        .returning(this.selectColumns("job", "job", this.jobColumns));

      if (rows.length !== 1) ***REMOVED***
        throw new Error("Problem occurred inserting job");
      ***REMOVED***
      const row = rows[0];

      rows = await trx("job")
        .where("id", row.job_id)
        .update(***REMOVED***
          slug: this.jobSlug(row.job_id, row.job_position)
        ***REMOVED***)
        .returning(this.selectColumns("job", "job", this.jobColumns));

      const job = Job.fromDb(rows[0], tags);

      await Promise.all(
        tags.map(tag => this.createJobTag(job.id, tag.id, ***REMOVED*** trx ***REMOVED***))
      );

      return job;
    ***REMOVED***);

    return job;
  ***REMOVED***

  async createJobTag(jobId, tagId, ***REMOVED*** trx = null ***REMOVED*** = ***REMOVED******REMOVED***) ***REMOVED***
    return (trx || this.knex)("job_tags").insert(***REMOVED***
      job_id: jobId,
      tag_id: tagId
    ***REMOVED***);
  ***REMOVED***

  async createCompany(companyData) ***REMOVED***
    const rows = await this.knex("company")
      .insert(***REMOVED***
        name: companyData.name,
        email: companyData.email,
        logo: companyData.logo
      ***REMOVED***)
      .returning(this.selectColumns("company", "company", this.companyColumns));
    return Company.fromDb(rows[0]);
  ***REMOVED***

  async findOrCreateTag(name, ***REMOVED*** trx = null ***REMOVED*** = ***REMOVED******REMOVED***) ***REMOVED***
    const res = await (trx || this.knex).raw(
      "with new_row as (insert into tag(name) select :name where not exists (select * from tag where name = :name) returning *) select * from new_row union select * from tag where name = :name",
      ***REMOVED*** name ***REMOVED***
    );
    return Tag.fromDb(res.rows[0]);
  ***REMOVED***

  async getPrimaryTags() ***REMOVED***
    const rows = this.knex("tag")
      .select()
      .where("is_primary", true)
      .orderBy("name");
    return rows.map(Tag.fromDb);
  ***REMOVED***

  async getJobs(***REMOVED***
    fromJobId,
    limit,
    closed = false,
    approved,
    withinDays,
    publicOnly = false
  ***REMOVED*** = ***REMOVED******REMOVED***) ***REMOVED***
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

    if (typeof fromJobId === "number") ***REMOVED***
      query = query.andWhere("job.id", "<=", fromJobId);
    ***REMOVED***
    if (typeof approved === "boolean") ***REMOVED***
      query = query.andWhere("job.approved", approved);
    ***REMOVED***
    if (typeof withinDays === "number") ***REMOVED***
      query = query.andWhere(
        "job.created",
        ">=",
        this.knex.raw("NOW() - (?*'1 DAY'::INTERVAL)", [withinDays])
      );
    ***REMOVED***
    if (typeof limit === "number") ***REMOVED***
      query = query.limit(limit);
    ***REMOVED***
    const rows = await query;
    return rows.map(row => ***REMOVED***
      let job = Job.fromDb(row, row.tags || []);
      if (publicOnly) ***REMOVED***
        job = job.publicData();
      ***REMOVED***
      return ***REMOVED***
        company: row.company_id && Company.fromDb(row),
        job
      ***REMOVED***;
    ***REMOVED***);
  ***REMOVED***

  selectColumns(tableName, prefix, fields) ***REMOVED***
    return fields.map(f => `$***REMOVED***tableName***REMOVED***.$***REMOVED***f***REMOVED*** as $***REMOVED***prefix***REMOVED***_$***REMOVED***f***REMOVED***`);
  ***REMOVED***

  jobQuery() ***REMOVED***
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
  ***REMOVED***

  async getJobBySlug(slug, where) ***REMOVED***
    const query = this.jobQuery().where("job.slug", slug);
    if (where) ***REMOVED***
      query.andWhere(where);
    ***REMOVED***
    const row = await query;
    if (!!row) ***REMOVED***
      const company = row.company_id && Company.fromDb(row);
      return ***REMOVED***
        company: company,
        job: Job.fromDb(row, row.tags || [])
      ***REMOVED***;
    ***REMOVED***
    return null;
  ***REMOVED***

  async getJobById(id) ***REMOVED***
    const row = await this.jobQuery().where("job.id", id);
    if (!!row) ***REMOVED***
      const company = row.company_id && Company.fromDb(row);
      return ***REMOVED***
        company: company,
        job: Job.fromDb(row, row.tags || [])
      ***REMOVED***;
    ***REMOVED***
    return null;
  ***REMOVED***

  async getUserByEmail(email) ***REMOVED***
    const row = await this.knex("users")
      .first()
      .where("email", email);
    return User.fromDb(row);
  ***REMOVED***

  async getUserById(id) ***REMOVED***
    const row = await this.knex("users")
      .first()
      .where("id", id);
    return User.fromDb(row);
  ***REMOVED***

  closeJob(id) ***REMOVED***
    return this.knex("job")
      .where("id", id)
      .update(***REMOVED***
        closed: true
      ***REMOVED***);
  ***REMOVED***

  approveJob(id) ***REMOVED***
    return this.knex("job")
      .where("id", id)
      .update(***REMOVED***
        approved: true
      ***REMOVED***);
  ***REMOVED***

  deleteJob(id) ***REMOVED***
    return this.knex("job")
      .where("id", id)
      .del();
  ***REMOVED***

  end() ***REMOVED***
    return this.pool.end();
  ***REMOVED***
***REMOVED***

module.exports = new Db();
