const faker = require("faker");

const db = require("./index");
const Job = require("../models/job");
const Tag = require("../models/tag");
const Company = require("../models/company");

describe("db", () => {
  afterEach(global.clearDb);

  afterAll(global.endDb);

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
      city: faker.address.city(),
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
      city: jobData.city,
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
    const insertQuery = `INSERT INTO job(position, job_type, description, apply_email) VALUES ($1, $2, $3, $4) RETURNING *`;
    const insertRes = await db.pool.query(insertQuery, [
      faker.name.jobTitle(),
      "Full-time",
      faker.lorem.sentences(),
      faker.internet.email()
    ]);
    const jobRow = insertRes.rows[0];
    const res = await db.getJobById(jobRow.id);
    expect(res).toMatchObject({
      company: null,
      job: Job.fromDb(jobRow, [])
    });
  });

  it("getJobs returns jobs", async () => {
    const tagQuery = `INSERT INTO tag(name) VALUES ($1) RETURNING *`;
    const resTag1 = await db.pool.query(tagQuery, [faker.lorem.word()]);
    const tag1 = Tag.fromDb(resTag1.rows[0]);
    const resTag2 = await db.pool.query(tagQuery, [faker.lorem.word()]);
    const tag2 = Tag.fromDb(resTag2.rows[0]);
    const resCompany = await db.pool.query(
      `INSERT INTO company(name, email) VALUES ($1, $2) RETURNING *`,
      [faker.company.companyName(), faker.internet.email()]
    );
    const company = Company.fromDb(resCompany.rows[0]);
    const jobRes = await db.pool.query(
      `INSERT INTO job(position, job_type, company_id, description, apply_email) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        faker.name.jobTitle(),
        "Full-time",
        company.id,
        faker.lorem.sentence(),
        faker.internet.email()
      ]
    );
    const jobTagQuery = `INSERT INTO job_tags(job_id, tag_id) VALUES ($1, $2)`;
    await db.pool.query(jobTagQuery, [jobRes.rows[0].id, tag1.id]);
    await db.pool.query(jobTagQuery, [jobRes.rows[0].id, tag2.id]);
    const res = await db.getJobs(-1);
    expect(res).toHaveLength(1);
    /* console.log({
      ["res[0]"]: res[0],
      result: {
        company,
        job: Job.fromDb(jobRes.rows[0], [tag1, tag2])
      }
    }); */
    expect(res[0]).toMatchObject({
      company,
      job: Job.fromDb(jobRes.rows[0], [tag1, tag2])
    });
  });

  it("getJobs cursor works", async () => {
    const res = await db.pool.query(
      `INSERT INTO job(position, job_type, description, apply_email) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8) RETURNING *`,
      [
        faker.name.jobTitle(),
        "Full-time",
        faker.lorem.sentences(),
        faker.internet.email(),
        faker.name.jobTitle(),
        "Part-time",
        faker.lorem.sentences(),
        faker.internet.email()
      ]
    );
    const firstJobId = res.rows[0].id;
    const jobs = await db.getJobs(firstJobId);
    expect(jobs).toHaveLength(1);
    expect(jobs[0].job.id).toBe(firstJobId);
  });

  it("getJobs can limit number of jobs", async () => {
    const res = await db.pool.query(
      `INSERT INTO job(position, job_type, description, apply_email) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8) RETURNING *`,
      [
        faker.name.jobTitle(),
        "Full-time",
        faker.lorem.sentences(),
        faker.internet.email(),
        faker.name.jobTitle(),
        "Part-time",
        faker.lorem.sentences(),
        faker.internet.email()
      ]
    );
    const jobs = await db.getJobs(-1, 1);
    expect(jobs).toHaveLength(1);
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
});
