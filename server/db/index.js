const assert = require("assert");
const ***REMOVED*** Pool ***REMOVED*** = require("pg");
const ***REMOVED*** Company, Tag, Job, User ***REMOVED*** = require("../models");
const Knex = require("knex");
const slug = require("slug");
const bcrypt = require("bcryptjs");

class Db ***REMOVED***
  constructor() ***REMOVED***
    this.pool = new Pool(***REMOVED***
      connectionString: process.env.DATABASE_URL
    ***REMOVED***);
    this.knex = Knex(***REMOVED***
      client: "pg",
      connection: process.env.DATABASE_URL
    ***REMOVED***);
    this.jobColumns = [
      "id",
      "position",
      "job_type",
      "company_id",
      "location",
      "salary",
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
      "admin_token",
      "deadline"
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
    let primaryTag;

    if (jobData.primaryTagId) ***REMOVED***
      const primaryTagRow = await this.knex("tag")
        .first()
        .where("id", jobData.primaryTagId);
      if (!primaryTagRow || primaryTagRow.is_primary === false) ***REMOVED***
        throw new Error("Primary tag value set to invalid tag");
      ***REMOVED***
      primaryTag = Tag.fromDb(primaryTagRow);
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
          location: jobData.location,
          salary: jobData.salary,
          deadline: jobData.deadline,
          description: jobData.description,
          responsibilities: jobData.responsibilities,
          requirements: jobData.requirements,
          how_to_apply: jobData.howToApply,
          apply_url: jobData.applyUrl,
          apply_email: jobData.applyEmail,
          approved: !!jobData.approved || false
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

      const job = Job.fromDb(
        rows[0],
        primaryTag ? [primaryTag, ...tags] : tags
      );

      if (jobData.primaryTagId) ***REMOVED***
        await this.createJobTag(job.id, jobData.primaryTagId, true, ***REMOVED*** trx ***REMOVED***);
      ***REMOVED***
      await Promise.all(
        tags.map(tag => this.createJobTag(job.id, tag.id, false, ***REMOVED*** trx ***REMOVED***))
      );

      return job;
    ***REMOVED***);

    return job;
  ***REMOVED***

  async createJobTag(jobId, tagId, isPrimary = false, ***REMOVED*** trx = null ***REMOVED*** = ***REMOVED******REMOVED***) ***REMOVED***
    return (trx || this.knex)("job_tags").insert(***REMOVED***
      job_id: jobId,
      tag_id: tagId,
      is_primary: isPrimary
    ***REMOVED***);
  ***REMOVED***

  async createCompany(companyData) ***REMOVED***
    const rows = await this.knex("company")
      .insert(***REMOVED***
        name: companyData.name,
        email: companyData.email,
        logo: companyData.logo,
        owner: companyData.owner || null
      ***REMOVED***)
      .returning(this.selectColumns("company", "company", this.companyColumns));
    return Company.fromDb(rows[0]);
  ***REMOVED***

  getCompanies(ownerId) ***REMOVED***
    return this.knex("company")
      .select()
      .where("owner", ownerId);
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
    tagIds = [],
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
    tagIds.forEach(tagId => ***REMOVED***
      const subQuery = this.knex("job_tags")
        .select("job_id")
        .whereIn(
          "tag_id",
          this.knex("tag")
            .select("id")
            .whereIn("id", [tagId])
        );
      query = query.where("job.id", "in", subQuery);
    ***REMOVED***);
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
    if (!!row) ***REMOVED***
      return User.fromDb(row);
    ***REMOVED***
  ***REMOVED***

  async createUser(userData) ***REMOVED***
    const hashedPassword = await bcrypt.hash(userData.password, 15);
    if (!userData) ***REMOVED***
      throw new Error("Invalid user data supplied");
    ***REMOVED***
    const rows = await this.knex("users")
      .insert(***REMOVED***
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
      ***REMOVED***)
      .returning("*");
    if (rows.length !== 1) ***REMOVED***
      throw new Error("Problem occurred creating user");
    ***REMOVED***
    return User.fromDb(rows[0]);
  ***REMOVED***

  async confirmUser(userId) ***REMOVED***
    await this.knex("users")
      .where("id", userId)
      .update(***REMOVED***
        confirmed: true
      ***REMOVED***);
  ***REMOVED***

  async getUserById(id) ***REMOVED***
    const row = await this.knex("users")
      .first()
      .where("id", id);
    if (!!row) ***REMOVED***
      return User.fromDb(row);
    ***REMOVED***
  ***REMOVED***

  async getTags(tagIds = []) ***REMOVED***
    const rows = await this.knex("tag")
      .select()
      .whereIn("id", tagIds);
    return rows.map(Tag.fromDb);
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

  createJobSocialPost(jobId, ***REMOVED*** telegramMessageId, facebookPostId ***REMOVED***) ***REMOVED***
    const data = ***REMOVED***
      job_id: jobId
    ***REMOVED***;
    if (!telegramMessageId && !facebookPostId) ***REMOVED***
      return;
    ***REMOVED***
    if (telegramMessageId) ***REMOVED***
      data.telegram_message_id = telegramMessageId;
    ***REMOVED***
    if (facebookPostId) ***REMOVED***
      data.facebook_post_id = facebookPostId;
    ***REMOVED***
    return this.knex("job_social_post").insert(data);
  ***REMOVED***

  async getJobSocialPost(jobId) ***REMOVED***
    const row = await this.knex("job_social_post")
      .first()
      .where("job_id", jobId);
    if (!!row) ***REMOVED***
      return ***REMOVED***
        telegramMessageId: row.telegram_message_id,
        facebookPostId: row.facebook_post_id
      ***REMOVED***;
    ***REMOVED***
  ***REMOVED***

  deleteJobSocialPost(jobId) ***REMOVED***
    return this.knex("job_social_post")
      .where("job_id", jobId)
      .del();
  ***REMOVED***

  createUserConfirmation(userId, confirmationKey) ***REMOVED***
    return this.knex("user_confirmation").insert(***REMOVED***
      user_id: userId,
      confirmation_key: confirmationKey
    ***REMOVED***);
  ***REMOVED***

  async getUserConfirmation(confirmationKey) ***REMOVED***
    const row = await this.knex("user_confirmation")
      .first()
      .where("confirmation_key", confirmationKey);
    if (row) ***REMOVED***
      return ***REMOVED*** userId: row.user_id, confirmationKey: row.confirmation_key ***REMOVED***;
    ***REMOVED***
  ***REMOVED***

  deleteUserConfirmation(userId) ***REMOVED***
    return this.knex("user_confirmation")
      .where("user_id", userId)
      .del();
  ***REMOVED***

  end() ***REMOVED***
    return this.pool.end();
  ***REMOVED***
***REMOVED***

module.exports = new Db();
