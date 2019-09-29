const faker = require("faker");
const db = require("./index");
const Job = require("../models/job");
const Tag = require("../models/tag");
const Company = require("../models/company");

describe("db", () => {
  afterEach(global.clearDb);

  afterAll(global.endDb);

  function sampleJobData(fields = {}) {
    return {
      position: faker.name.jobTitle(),
      job_type: "Full-time",
      description: faker.lorem.sentences(),
      apply_email: faker.internet.email(),
      ...fields
    };
  }

  function sampleTagData(fields = {}) {
    return {
      name: faker.lorem.word(),
      is_primary: false,
      ...fields
    };
  }

  it("should create company", async () => {
    const companyData = {
      name: faker.company.companyName(),
      email: faker.internet.email(),
      logo: faker.image.imageUrl()
    };
    const company = await db.createCompany(companyData);
    expect(company).toMatchObject(companyData);
  });

  it("createCompany should fail when email is missing", async () => {
    const companyData = {
      name: faker.company.companyName()
    };
    await expect(db.createCompany(companyData)).rejects.toThrow();
  });
  it("createCompany should fail when name is missing", async () => {
    const companyData = {
      email: faker.internet.email()
    };
    await expect(db.createCompany(companyData)).rejects.toThrow();
  });

  it("findOrCreateTag should create tag", async () => {
    const tagData = { name: faker.lorem.word() };
    const tag = await db.findOrCreateTag(tagData.name);
    expect(tag).toMatchObject({
      name: tagData.name,
      isPrimary: false
    });
  });

  it("findOrCreateTag returns existing tag if name already exists", async () => {
    const tagName = faker.lorem.word();
    await db.findOrCreateTag(tagName);
    await db.findOrCreateTag(tagName);
    const res = await db.pool.query(`SELECT COUNT(*) FROM tag`);
    expect(res.rows[0].count).toBe("1");
  });

  it("createJobAndCompany creates job and company", async () => {
    const data = {
      company: {
        name: faker.company.companyName(),
        email: faker.internet.email(),
        logo: faker.image.imageUrl()
      },
      job: {
        position: faker.lorem.sentence(),
        jobType: "Full-time",
        tags: [faker.random.word()],
        description: faker.lorem.sentences(),
        applyEmail: faker.internet.email()
      }
    };
    const { job, company } = await db.createJobAndCompany(data);
    expect(job).toMatchObject({
      position: data.job.position,
      jobType: data.job.jobType,
      tags: [{ name: data.job.tags[0], isPrimary: false }],
      description: data.job.description,
      applyEmail: data.job.applyEmail
    });
    expect(company).toMatchObject(data.company);
  });

  it("createJob creates job", async () => {
    const tagRes = await db.pool.query(
      `INSERT INTO tag(name, is_primary) VALUES ($1, $2) RETURNING *`,
      ["dev", true]
    );
    const tagId = tagRes.rows[0].id;
    const company = await db.createCompany({
      name: faker.company.companyName(),
      email: faker.internet.email(),
      logo: faker.image.imageUrl()
    });
    const jobData = {
      position: faker.lorem.sentence(),
      jobType: "Full-time",
      location: faker.address.city(),
      primaryTagId: tagId,
      tags: [faker.random.word(), faker.random.word()],
      monthlySalary: faker.finance.amount(),
      description: faker.lorem.sentences(),
      responsibilities: faker.lorem.sentences(),
      requirements: faker.lorem.sentences(),
      howToApply: faker.lorem.sentences(),
      applyUrl: faker.internet.url(),
      applyEmail: ""
    };
    const job = await db.createJob(jobData, company.id);
    expect(job).toMatchObject({
      position: jobData.position,
      jobType: jobData.jobType,
      location: jobData.location,
      companyId: company.id,
      primaryTagId: tagId,
      tags: [
        {
          name: jobData.tags[0],
          isPrimary: false
        },
        {
          name: jobData.tags[1],
          isPrimary: false
        }
      ],
      monthlySalary: jobData.monthlySalary,
      description: jobData.description,
      requirements: jobData.requirements,
      howToApply: jobData.howToApply,
      applyUrl: jobData.applyUrl,
      applyEmail: jobData.applyEmail
    });
    expect(job.slug).toBe(db.jobSlug(job.id, job.position));
    const tagCountRes = await db.pool.query(`SELECT COUNT(*) FROM tag`);
    expect(tagCountRes.rows[0].count).toBe("3");
    const jobTagRes = await db.pool.query(`SELECT COUNT(*) FROM job_tags`);
    expect(jobTagRes.rows[0].count).toBe("2");
  });

  it("createJob should work without company", async () => {
    const jobData = {
      position: faker.lorem.sentence(),
      jobType: "Full-time",
      tags: [],
      description: faker.lorem.sentences(),
      applyEmail: faker.internet.email()
    };
    const job = await db.createJob(jobData);
    expect(job).toMatchObject({
      position: jobData.position,
      jobType: jobData.jobType,
      tags: jobData.tags,
      description: jobData.description,
      applyEmail: jobData.applyEmail
    });
  });

  it("createJob should fail when position is missing", async () => {
    const jobData = {
      jobType: "Full-time",
      tags: [],
      description: faker.lorem.sentences(),
      applyEmail: faker.internet.email()
    };
    await expect(db.createJob(jobData)).rejects.toThrow();
  });

  it("createJob should fail when description is missing", async () => {
    const jobData = {
      position: faker.lorem.sentence(),
      jobType: "Full-time",
      tags: [],
      applyEmail: faker.internet.email()
    };
    await expect(db.createJob(jobData)).rejects.toThrow();
  });

  it("createJob should fail when either of applyEmail or applyUrl is missing", async () => {
    const jobData = {
      position: faker.lorem.sentence(),
      jobType: "Full-time",
      description: faker.lorem.sentences(),
      tags: []
    };
    await expect(db.createJob(jobData)).rejects.toThrow();
  });

  it("getPrimaryTags only returns primary tags", async () => {
    const query = `INSERT INTO tag(name, is_primary) VALUES ($1, $2), ($3, $4);`;
    const values = ["React", true, "Vue.js", false];
    await db.pool.query(query, values);
    const primaryTags = await db.getPrimaryTags();
    expect(primaryTags).toHaveLength(1);
    expect(primaryTags[0].name).toBe("React");
    expect(primaryTags[0].isPrimary).toBe(true);
  });

  it("getJobById returns job data", async () => {
    const rows = await db
      .knex("job")
      .insert({
        position: faker.name.jobTitle(),
        job_type: "Full-time",
        description: faker.lorem.sentences(),
        apply_email: faker.internet.email()
      })
      .returning(db.selectColumns("job", "job", db.jobColumns));
    const jobRow = rows[0];
    const res = await db.getJobById(jobRow.job_id);

    expect(res).toMatchObject({
      company: null,
      job: Job.fromDb(jobRow, [])
    });
  });

  it("getJobs returns jobs with tags", async () => {
    const sortById = (obj1, obj2) => (obj1.id > obj2.id ? 1 : -1);
    const tag1 = Tag.fromDb(
      (await db
        .knex("tag")
        .insert({ name: faker.lorem.word() })
        .returning("*"))[0]
    );
    const tag2 = Tag.fromDb(
      (await db
        .knex("tag")
        .insert({ name: faker.lorem.word() })
        .returning("*"))[0]
    );
    const company = Company.fromDb(
      (await db
        .knex("company")
        .insert({
          name: faker.company.companyName(),
          email: faker.internet.email()
        })
        .returning(
          db.selectColumns("company", "company", db.companyColumns)
        ))[0]
    );
    const job = Job.fromDb(
      (await db
        .knex("job")
        .insert({
          position: faker.name.jobTitle(),
          job_type: "Full-time",
          company_id: company.id,
          description: faker.lorem.sentence(),
          apply_email: faker.internet.email()
        })
        .returning(db.selectColumns("job", "job", db.jobColumns)))[0],
      [tag1, tag2].sort(sortById)
    );
    await db.knex("job_tags").insert([
      {
        job_id: job.id,
        tag_id: tag1.id
      },
      {
        job_id: job.id,
        tag_id: tag2.id
      }
    ]);
    const jobs = await db.getJobs();
    expect(jobs).toHaveLength(1);
    jobs[0].job.tags = jobs[0].job.tags.sort(sortById);
    expect(jobs[0]).toMatchObject({
      company,
      job
    });
  });

  it("getJobs cursor works", async () => {
    const rows = await db
      .knex("job")
      .insert([
        {
          position: faker.name.jobTitle(),
          job_type: "Full-time",
          description: faker.lorem.sentences(),
          apply_email: faker.internet.email()
        },
        {
          position: faker.name.jobTitle(),
          job_type: "Part-time",
          description: faker.lorem.sentences(),
          apply_email: faker.internet.email()
        }
      ])
      .returning("*");
    const firstJobId = rows[0].id;
    const jobs = await db.getJobs({ fromJobId: firstJobId });
    expect(jobs).toHaveLength(1);
    expect(jobs[0].job.id).toBe(firstJobId);
  });

  it("getJobs can limit number of jobs", async () => {
    await db
      .knex("job")
      .insert([
        {
          position: faker.name.jobTitle(),
          job_type: "Full-time",
          description: faker.lorem.sentences(),
          apply_email: faker.internet.email()
        },
        {
          position: faker.name.jobTitle(),
          job_type: "Part-time",
          description: faker.lorem.sentences(),
          apply_email: faker.internet.email()
        }
      ])
      .returning("*");
    const jobs = await db.getJobs({ limit: 1 });
    expect(jobs).toHaveLength(1);
  });

  it("getJobs can filter by approved status", async () => {
    const approvedJobData = sampleJobData({ approved: true });
    const jobData = sampleJobData();
    const jobRows = await db
      .knex("job")
      .insert([approvedJobData, jobData])
      .returning(db.selectColumns("job", "job", db.jobColumns));
    expect(jobRows).toHaveLength(2);
    const jobResults = await db.getJobs({ approved: true });
    expect(jobResults).toHaveLength(1);
    expect(jobResults[0].job.position).toBe(approvedJobData.position);
  });

  it("getJobs can limit results within day ranges", async () => {
    const recentJobData = sampleJobData({ created: new Date() });
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 31);
    const oldJobData = sampleJobData({ created: expiredDate });
    const jobRows = await db
      .knex("job")
      .insert([recentJobData, oldJobData])
      .returning(db.selectColumns("job", "job", db.jobColumns));
    expect(jobRows).toHaveLength(2);
    const jobResults = await db.getJobs({ withinDays: 30 });
    expect(jobResults).toHaveLength(1);
    expect(jobResults[0].job.position).toBe(recentJobData.position);
  });

  it("getUserByEmail works", async () => {
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user"
    };
    const res = await db.pool.query(
      `INSERT INTO users(first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user.firstName, user.lastName, user.email, user.password, user.role]
    );
    const resUser = await db.getUserByEmail(user.email);
    expect(resUser).toMatchObject(user);
  });

  it("getUserById works", async () => {
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user"
    };
    const res = await db.pool.query(
      `INSERT INTO users(first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user.firstName, user.lastName, user.email, user.password, user.role]
    );
    const userId = res.rows[0].id;
    const resUser = await db.getUserById(userId);
    expect(resUser).toMatchObject(user);
  });

  it("approveJob should approve pending job", async () => {
    const jobData = sampleJobData({});
    const jobRows = await db
      .knex("job")
      .insert(jobData)
      .returning(db.selectColumns("job", "job", db.jobColumns));
    expect(jobRows).toHaveLength(1);
    const jobId = jobRows[0]["job_id"];
    const result = await db.approveJob(jobId);
    expect(result).toBe(1);
    const result2 = await db.approveJob(1);
    expect(result2).toBe(0);
  });

  it("closeJob should close a job", async () => {
    const jobData = sampleJobData({});
    const jobRows = await db
      .knex("job")
      .insert(jobData)
      .returning(db.selectColumns("job", "job", db.jobColumns));
    expect(jobRows).toHaveLength(1);
    const jobId = jobRows[0]["job_id"];
    const result = await db.closeJob(jobId);
    expect(result).toBe(1);
    const result2 = await db.closeJob(1);
    expect(result2).toBe(0);
  });

  it("deleteJob should delete job", async () => {
    const jobData = sampleJobData();
    const jobRows = await db
      .knex("job")
      .insert(jobData)
      .returning(db.selectColumns("job", "job", db.jobColumns));
    expect(jobRows).toHaveLength(1);
    const jobId = jobRows[0]["job_id"];
    const result = await db.deleteJob(jobId);
    expect(result).toBe(1);
    const result2 = await db.deleteJob(2);
    expect(result2).toBe(0);
  });

  it.only("getTags returns tags", async () => {
    const rows = await db
      .knex("tag")
      .insert([sampleTagData(), sampleTagData()])
      .returning("*");
    expect(rows.length).toBe(2);
    const tags = await db.getTags([rows[0].id, rows[1].id]);
    expect(tags).toHaveLength(2);
  });
});
