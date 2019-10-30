const assert = require("assert");
const { Pool } = require("pg");
const { Company, Tag, Job, User } = require("../models");
const Knex = require("knex");
const slug = require("slug");
const bcrypt = require("bcryptjs");

class Db {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
    this.knex = Knex({
      client: "pg",
      connection: process.env.DATABASE_URL
    });
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
    let primaryTag;

    if (jobData.primaryTagId) {
      const primaryTagRow = await this.knex("tag")
        .first()
        .where("id", jobData.primaryTagId);
      if (!primaryTagRow || primaryTagRow.is_primary === false) {
        throw new Error("Primary tag value set to invalid tag");
      }
      primaryTag = Tag.fromDb(primaryTagRow);
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

      const job = Job.fromDb(
        rows[0],
        primaryTag ? [primaryTag, ...tags] : tags
      );

      if (jobData.primaryTagId) {
        await this.createJobTag(job.id, jobData.primaryTagId, true, { trx });
      }
      await Promise.all(
        tags.map(tag => this.createJobTag(job.id, tag.id, false, { trx }))
      );

      return job;
    });

    return job;
  }

  async createJobTag(jobId, tagId, isPrimary = false, { trx = null } = {}) {
    return (trx || this.knex)("job_tags").insert({
      job_id: jobId,
      tag_id: tagId,
      is_primary: isPrimary
    });
  }

  async createCompany(companyData) {
    const rows = await this.knex("company")
      .insert({
        name: companyData.name,
        email: companyData.email,
        logo: companyData.logo,
        owner: companyData.owner || null
      })
      .returning(this.selectColumns("company", "company", this.companyColumns));
    return Company.fromDb(rows[0]);
  }

  async updateCompany(companyId, ownerId, companyData) {
    const rows = await this.knex("company")
      .where({
        id: companyId,
        owner: ownerId
      })
      .update({
        name: companyData.name,
        email: companyData.email,
        logo: companyData.logo
      })
      .returning("*");
    if (rows.length > 0) {
      return rows[0];
    }
  }

  getCompanies(ownerId) {
    return this.knex("company")
      .select()
      .where("owner", ownerId);
  }

  async findOrCreateTag(name, { trx = null } = {}) {
    const res = await (trx || this.knex).raw(
      "with new_row as (insert into tag(name) select :name where not exists (select * from tag where name = :name) returning *) select * from new_row union select * from tag where name = :name",
      { name }
    );
    return Tag.fromDb(res.rows[0]);
  }

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
    withinDays,
    tagIds = [],
    publicOnly = false
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
    tagIds.forEach(tagId => {
      const subQuery = this.knex("job_tags")
        .select("job_id")
        .whereIn(
          "tag_id",
          this.knex("tag")
            .select("id")
            .whereIn("id", [tagId])
        );
      query = query.where("job.id", "in", subQuery);
    });
    const rows = await query;
    return rows.map(row => {
      let job = Job.fromDb(row, row.tags || []);
      if (publicOnly) {
        job = job.publicData();
      }
      return {
        company: row.company_id && Company.fromDb(row),
        job
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

  async getJobBySlug(slug, where) {
    const query = this.jobQuery().where("job.slug", slug);
    if (where) {
      query.andWhere(where);
    }
    const row = await query;
    if (!!row) {
      const company = row.company_id && Company.fromDb(row);
      return {
        company: company,
        job: Job.fromDb(row, row.tags || [])
      };
    }
    return null;
  }

  async getJobById(id) {
    const row = await this.jobQuery().where("job.id", id);
    if (!!row) {
      const company = row.company_id && Company.fromDb(row);
      return {
        company: company,
        job: Job.fromDb(row, row.tags || [])
      };
    }
    return null;
  }

  getCompany(companyId, ownerId) {
    return this.knex("company")
      .first()
      .where({
        id: companyId,
        owner: ownerId
      });
  }

  async getUserByEmail(email) {
    const row = await this.knex("users")
      .first()
      .where("email", email);
    if (!!row) {
      return User.fromDb(row);
    }
  }

  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 15);
    if (!userData) {
      throw new Error("Invalid user data supplied");
    }
    const rows = await this.knex("users")
      .insert({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
      })
      .returning("*");
    if (rows.length !== 1) {
      throw new Error("Problem occurred creating user");
    }
    return User.fromDb(rows[0]);
  }

  async confirmUser(userId) {
    await this.knex("users")
      .where("id", userId)
      .update({
        confirmed: true
      });
  }

  async getUserById(id) {
    const row = await this.knex("users")
      .first()
      .where("id", id);
    if (!!row) {
      return User.fromDb(row);
    }
  }

  async getTags(tagIds = []) {
    const rows = await this.knex("tag")
      .select()
      .whereIn("id", tagIds);
    return rows.map(Tag.fromDb);
  }

  closeJob(id) {
    return this.knex("job")
      .where("id", id)
      .update({
        closed: true
      });
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

  deleteCompany(id, ownerId) {
    return this.knex("company")
      .where({
        id,
        owner: ownerId
      })
      .del();
  }

  createJobSocialPost(jobId, { telegramMessageId, facebookPostId }) {
    const data = {
      job_id: jobId
    };
    if (!telegramMessageId && !facebookPostId) {
      return;
    }
    if (telegramMessageId) {
      data.telegram_message_id = telegramMessageId;
    }
    if (facebookPostId) {
      data.facebook_post_id = facebookPostId;
    }
    return this.knex("job_social_post").insert(data);
  }

  async getJobSocialPost(jobId) {
    const row = await this.knex("job_social_post")
      .first()
      .where("job_id", jobId);
    if (!!row) {
      return {
        telegramMessageId: row.telegram_message_id,
        facebookPostId: row.facebook_post_id
      };
    }
  }

  deleteJobSocialPost(jobId) {
    return this.knex("job_social_post")
      .where("job_id", jobId)
      .del();
  }

  createUserConfirmation(userId, confirmationKey) {
    return this.knex("user_confirmation").insert({
      user_id: userId,
      confirmation_key: confirmationKey
    });
  }

  async getUserConfirmation(confirmationKey) {
    const row = await this.knex("user_confirmation")
      .first()
      .where("confirmation_key", confirmationKey);
    if (row) {
      return { userId: row.user_id, confirmationKey: row.confirmation_key };
    }
  }

  deleteUserConfirmation(userId) {
    return this.knex("user_confirmation")
      .where("user_id", userId)
      .del();
  }

  end() {
    return this.pool.end();
  }
}

module.exports = new Db();
