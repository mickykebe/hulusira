const faker = require("faker");
const db = require("./index");
const Job = require("../models/job");
const Tag = require("../models/tag");
const Company = require("../models/company");

describe("db", () => ***REMOVED***
  afterEach(global.clearDb);

  afterAll(global.endDb);

  function sampleJobData(fields = ***REMOVED******REMOVED***) ***REMOVED***
    return ***REMOVED***
      position: faker.name.jobTitle(),
      job_type: "Full-time",
      description: faker.lorem.sentences(),
      apply_email: faker.internet.email(),
      ...fields
    ***REMOVED***;
  ***REMOVED***

  function sampleTagData(fields = ***REMOVED******REMOVED***) ***REMOVED***
    return ***REMOVED***
      name: faker.lorem.word(),
      is_primary: false,
      ...fields
    ***REMOVED***;
  ***REMOVED***

  it("should create company", async () => ***REMOVED***
    const companyData = ***REMOVED***
      name: faker.company.companyName(),
      email: faker.internet.email(),
      logo: faker.image.imageUrl()
    ***REMOVED***;
    const company = await db.createCompany(companyData);
    expect(company).toMatchObject(companyData);
  ***REMOVED***);

  it("createCompany should fail when email is missing", async () => ***REMOVED***
    const companyData = ***REMOVED***
      name: faker.company.companyName()
    ***REMOVED***;
    await expect(db.createCompany(companyData)).rejects.toThrow();
  ***REMOVED***);
  it("createCompany should fail when name is missing", async () => ***REMOVED***
    const companyData = ***REMOVED***
      email: faker.internet.email()
    ***REMOVED***;
    await expect(db.createCompany(companyData)).rejects.toThrow();
  ***REMOVED***);

  it("findOrCreateTag should create tag", async () => ***REMOVED***
    const tagData = ***REMOVED*** name: faker.lorem.word() ***REMOVED***;
    const tag = await db.findOrCreateTag(tagData.name);
    expect(tag).toMatchObject(***REMOVED***
      name: tagData.name,
      isPrimary: false
    ***REMOVED***);
  ***REMOVED***);

  it("findOrCreateTag returns existing tag if name already exists", async () => ***REMOVED***
    const tagName = faker.lorem.word();
    await db.findOrCreateTag(tagName);
    await db.findOrCreateTag(tagName);
    const res = await db.pool.query(`SELECT COUNT(*) FROM tag`);
    expect(res.rows[0].count).toBe("1");
  ***REMOVED***);

  it("createJobAndCompany creates job and company", async () => ***REMOVED***
    const data = ***REMOVED***
      company: ***REMOVED***
        name: faker.company.companyName(),
        email: faker.internet.email(),
        logo: faker.image.imageUrl()
      ***REMOVED***,
      job: ***REMOVED***
        position: faker.lorem.sentence(),
        jobType: "Full-time",
        tags: [faker.random.word()],
        description: faker.lorem.sentences(),
        applyEmail: faker.internet.email()
      ***REMOVED***
    ***REMOVED***;
    const ***REMOVED*** job, company ***REMOVED*** = await db.createJobAndCompany(data);
    expect(job).toMatchObject(***REMOVED***
      position: data.job.position,
      jobType: data.job.jobType,
      tags: [***REMOVED*** name: data.job.tags[0], isPrimary: false ***REMOVED***],
      description: data.job.description,
      applyEmail: data.job.applyEmail
    ***REMOVED***);
    expect(company).toMatchObject(data.company);
  ***REMOVED***);

  it("createJob creates job", async () => ***REMOVED***
    const primaryTag = ***REMOVED*** name: "dev", isPrimary: true ***REMOVED***;
    const tagRes = await db.pool.query(
      `INSERT INTO tag(name, is_primary) VALUES ($1, $2) RETURNING *`,
      [primaryTag.name, primaryTag.isPrimary]
    );
    const tagId = tagRes.rows[0].id;
    const company = await db.createCompany(***REMOVED***
      name: faker.company.companyName(),
      email: faker.internet.email(),
      logo: faker.image.imageUrl()
    ***REMOVED***);
    const jobData = ***REMOVED***
      position: faker.lorem.sentence(),
      jobType: "Full-time",
      location: faker.address.city(),
      primaryTagId: tagId,
      tags: [faker.random.word(), faker.random.word()],
      salary: faker.finance.amount(),
      description: faker.lorem.sentences(),
      responsibilities: faker.lorem.sentences(),
      requirements: faker.lorem.sentences(),
      howToApply: faker.lorem.sentences(),
      applyUrl: faker.internet.url(),
      applyEmail: ""
    ***REMOVED***;
    const job = await db.createJob(jobData, company.id);
    expect(job).toMatchObject(***REMOVED***
      position: jobData.position,
      jobType: jobData.jobType,
      location: jobData.location,
      companyId: company.id,
      tags: [
        ***REMOVED***
          name: primaryTag.name,
          isPrimary: true
        ***REMOVED***,
        ***REMOVED***
          name: jobData.tags[0],
          isPrimary: false
        ***REMOVED***,
        ***REMOVED***
          name: jobData.tags[1],
          isPrimary: false
        ***REMOVED***
      ],
      salary: jobData.salary,
      description: jobData.description,
      requirements: jobData.requirements,
      howToApply: jobData.howToApply,
      applyUrl: jobData.applyUrl,
      applyEmail: jobData.applyEmail
    ***REMOVED***);
    expect(job.slug).toBe(db.jobSlug(job.id, job.position));
    const tagCountRes = await db.pool.query(`SELECT COUNT(*) FROM tag`);
    expect(tagCountRes.rows[0].count).toBe("3");
    const jobTagRes = await db.pool.query(`SELECT COUNT(*) FROM job_tags`);
    expect(jobTagRes.rows[0].count).toBe("3");
  ***REMOVED***);

  it("createJob should work without company", async () => ***REMOVED***
    const jobData = ***REMOVED***
      position: faker.lorem.sentence(),
      jobType: "Full-time",
      tags: [],
      description: faker.lorem.sentences(),
      applyEmail: faker.internet.email()
    ***REMOVED***;
    const job = await db.createJob(jobData);
    expect(job).toMatchObject(***REMOVED***
      position: jobData.position,
      jobType: jobData.jobType,
      tags: jobData.tags,
      description: jobData.description,
      applyEmail: jobData.applyEmail
    ***REMOVED***);
  ***REMOVED***);

  it("createJob should fail when position is missing", async () => ***REMOVED***
    const jobData = ***REMOVED***
      jobType: "Full-time",
      tags: [],
      description: faker.lorem.sentences(),
      applyEmail: faker.internet.email()
    ***REMOVED***;
    await expect(db.createJob(jobData)).rejects.toThrow();
  ***REMOVED***);

  it("createJob should fail when description is missing", async () => ***REMOVED***
    const jobData = ***REMOVED***
      position: faker.lorem.sentence(),
      jobType: "Full-time",
      tags: [],
      applyEmail: faker.internet.email()
    ***REMOVED***;
    await expect(db.createJob(jobData)).rejects.toThrow();
  ***REMOVED***);

  it("createJob should fail when either of applyEmail or applyUrl is missing", async () => ***REMOVED***
    const jobData = ***REMOVED***
      position: faker.lorem.sentence(),
      jobType: "Full-time",
      description: faker.lorem.sentences(),
      tags: []
    ***REMOVED***;
    await expect(db.createJob(jobData)).rejects.toThrow();
  ***REMOVED***);

  it("getPrimaryTags only returns primary tags", async () => ***REMOVED***
    const query = `INSERT INTO tag(name, is_primary) VALUES ($1, $2), ($3, $4);`;
    const values = ["React", true, "Vue.js", false];
    await db.pool.query(query, values);
    const primaryTags = await db.getPrimaryTags();
    expect(primaryTags).toHaveLength(1);
    expect(primaryTags[0].name).toBe("React");
    expect(primaryTags[0].isPrimary).toBe(true);
  ***REMOVED***);

  it("getJobById returns job data", async () => ***REMOVED***
    const rows = await db
      .knex("job")
      .insert(***REMOVED***
        position: faker.name.jobTitle(),
        job_type: "Full-time",
        description: faker.lorem.sentences(),
        apply_email: faker.internet.email()
      ***REMOVED***)
      .returning(db.selectColumns("job", "job", db.jobColumns));
    const jobRow = rows[0];
    const res = await db.getJobById(jobRow.job_id);

    expect(res).toMatchObject(***REMOVED***
      company: null,
      job: Job.fromDb(jobRow, [])
    ***REMOVED***);
  ***REMOVED***);

  it("getJobs returns jobs with tags", async () => ***REMOVED***
    const sortById = (obj1, obj2) => (obj1.id > obj2.id ? 1 : -1);
    const tag1 = Tag.fromDb(
      (await db
        .knex("tag")
        .insert(***REMOVED*** name: faker.lorem.word() ***REMOVED***)
        .returning("*"))[0]
    );
    const tag2 = Tag.fromDb(
      (await db
        .knex("tag")
        .insert(***REMOVED*** name: faker.lorem.word() ***REMOVED***)
        .returning("*"))[0]
    );
    const company = Company.fromDb(
      (await db
        .knex("company")
        .insert(***REMOVED***
          name: faker.company.companyName(),
          email: faker.internet.email()
        ***REMOVED***)
        .returning(
          db.selectColumns("company", "company", db.companyColumns)
        ))[0]
    );
    const job = Job.fromDb(
      (await db
        .knex("job")
        .insert(***REMOVED***
          position: faker.name.jobTitle(),
          job_type: "Full-time",
          company_id: company.id,
          description: faker.lorem.sentence(),
          apply_email: faker.internet.email()
        ***REMOVED***)
        .returning(db.selectColumns("job", "job", db.jobColumns)))[0],
      [tag1, tag2].sort(sortById)
    );
    await db.knex("job_tags").insert([
      ***REMOVED***
        job_id: job.id,
        tag_id: tag1.id
      ***REMOVED***,
      ***REMOVED***
        job_id: job.id,
        tag_id: tag2.id
      ***REMOVED***
    ]);
    const jobs = await db.getJobs();
    expect(jobs).toHaveLength(1);
    jobs[0].job.tags = jobs[0].job.tags.sort(sortById);
    expect(jobs[0]).toMatchObject(***REMOVED***
      company,
      job
    ***REMOVED***);
  ***REMOVED***);

  it("getJobs cursor works", async () => ***REMOVED***
    const rows = await db
      .knex("job")
      .insert([
        ***REMOVED***
          position: faker.name.jobTitle(),
          job_type: "Full-time",
          description: faker.lorem.sentences(),
          apply_email: faker.internet.email()
        ***REMOVED***,
        ***REMOVED***
          position: faker.name.jobTitle(),
          job_type: "Part-time",
          description: faker.lorem.sentences(),
          apply_email: faker.internet.email()
        ***REMOVED***
      ])
      .returning("*");
    const firstJobId = rows[0].id;
    const jobs = await db.getJobs(***REMOVED*** fromJobId: firstJobId ***REMOVED***);
    expect(jobs).toHaveLength(1);
    expect(jobs[0].job.id).toBe(firstJobId);
  ***REMOVED***);

  it("getJobs can limit number of jobs", async () => ***REMOVED***
    await db
      .knex("job")
      .insert([
        ***REMOVED***
          position: faker.name.jobTitle(),
          job_type: "Full-time",
          description: faker.lorem.sentences(),
          apply_email: faker.internet.email()
        ***REMOVED***,
        ***REMOVED***
          position: faker.name.jobTitle(),
          job_type: "Part-time",
          description: faker.lorem.sentences(),
          apply_email: faker.internet.email()
        ***REMOVED***
      ])
      .returning("*");
    const jobs = await db.getJobs(***REMOVED*** limit: 1 ***REMOVED***);
    expect(jobs).toHaveLength(1);
  ***REMOVED***);

  it("getJobs can filter by approved status", async () => ***REMOVED***
    const approvedJobData = sampleJobData(***REMOVED*** approved: true ***REMOVED***);
    const jobData = sampleJobData();
    const jobRows = await db
      .knex("job")
      .insert([approvedJobData, jobData])
      .returning(db.selectColumns("job", "job", db.jobColumns));
    expect(jobRows).toHaveLength(2);
    const jobResults = await db.getJobs(***REMOVED*** approved: true ***REMOVED***);
    expect(jobResults).toHaveLength(1);
    expect(jobResults[0].job.position).toBe(approvedJobData.position);
  ***REMOVED***);

  it("getJobs can limit results within day ranges", async () => ***REMOVED***
    const recentJobData = sampleJobData(***REMOVED*** created: new Date() ***REMOVED***);
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 31);
    const oldJobData = sampleJobData(***REMOVED*** created: expiredDate ***REMOVED***);
    const jobRows = await db
      .knex("job")
      .insert([recentJobData, oldJobData])
      .returning(db.selectColumns("job", "job", db.jobColumns));
    expect(jobRows).toHaveLength(2);
    const jobResults = await db.getJobs(***REMOVED*** withinDays: 30 ***REMOVED***);
    expect(jobResults).toHaveLength(1);
    expect(jobResults[0].job.position).toBe(recentJobData.position);
  ***REMOVED***);

  it("getUserByEmail works", async () => ***REMOVED***
    const user = ***REMOVED***
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user"
    ***REMOVED***;
    const res = await db.pool.query(
      `INSERT INTO users(first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user.firstName, user.lastName, user.email, user.password, user.role]
    );
    const resUser = await db.getUserByEmail(user.email);
    expect(resUser).toMatchObject(user);
  ***REMOVED***);

  it("getUserById works", async () => ***REMOVED***
    const user = ***REMOVED***
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user"
    ***REMOVED***;
    const res = await db.pool.query(
      `INSERT INTO users(first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user.firstName, user.lastName, user.email, user.password, user.role]
    );
    const userId = res.rows[0].id;
    const resUser = await db.getUserById(userId);
    expect(resUser).toMatchObject(user);
  ***REMOVED***);

  it("approveJob should approve pending job", async () => ***REMOVED***
    const jobData = sampleJobData(***REMOVED******REMOVED***);
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
  ***REMOVED***);

  it("closeJob should close a job", async () => ***REMOVED***
    const jobData = sampleJobData(***REMOVED******REMOVED***);
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
  ***REMOVED***);

  it("deleteJob should delete job", async () => ***REMOVED***
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
  ***REMOVED***);

  it("getTags returns tags", async () => ***REMOVED***
    const rows = await db
      .knex("tag")
      .insert([sampleTagData(), sampleTagData()])
      .returning("*");
    expect(rows.length).toBe(2);
    const tags = await db.getTags([rows[0].id, rows[1].id]);
    expect(tags).toHaveLength(2);
  ***REMOVED***);
***REMOVED***);
