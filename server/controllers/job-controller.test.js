const request = require("supertest");
const faker = require("faker");
const app = require("../app");
const db = require("../db");
const utils = require("../utils");
jest.mock("../db");

describe("POST to /new", () => {
  it("Validation error if position is missing", async () => {
    const jobData = {
      description: faker.name.jobDescriptor(),
      primaryTagId: 1,
      jobType: "Full-time",
      applyUrl: faker.internet.url()
    };
    const response = await request(app)
      .post("/api/new")
      .send(jobData);
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject({
      error: [{ path: "position" }]
    });
  });
  it("Validation error if description is missing", async () => {
    const jobData = {
      position: faker.name.jobTitle(),
      primaryTagId: 1,
      jobType: "Part-time",
      applyUrl: faker.internet.url()
    };
    const response = await request(app)
      .post("/api/new")
      .send(jobData);
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject({
      error: [{ path: "description" }]
    });
  });
  it("Validation error if job type is missing", async () => {
    const jobData = {
      position: faker.name.jobTitle(),
      description: faker.lorem.sentences(),
      primaryTagId: 1,
      applyUrl: faker.internet.url()
    };
    const response = await request(app)
      .post("/api/new")
      .send(jobData);
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject({
      error: [{ path: "jobType" }]
    });
  });
  it("Validation error if both primaryTag and tags are empty", async () => {
    const jobData = {
      position: faker.name.jobTitle(),
      description: faker.name.jobDescriptor(),
      jobType: "Freelance",
      applyUrl: faker.internet.url()
    };
    const response = await request(app)
      .post("/api/new")
      .send(jobData);
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject({
      error: [{ path: "primaryTagId" }, { path: "tags" }]
    });
  });

  it("Validation error if both applyEmail and applyUrl are missing", async () => {
    const jobData = {
      position: faker.name.jobTitle(),
      description: faker.name.jobDescriptor(),
      jobType: "Internship",
      primaryTagId: 1
    };
    const response = await request(app)
      .post("/api/new")
      .send(jobData);
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject({
      error: [{ path: "applyUrl" }, { path: "applyEmail" }]
    });
  });
  it("Validation error if hasCompany is true and company name and email are missing", async () => {
    const jobData = {
      position: faker.name.jobTitle(),
      description: faker.name.jobDescriptor(),
      jobType: "Temporary",
      primaryTagId: 1,
      applyUrl: faker.internet.url(),
      hasCompany: true
    };
    const response = await request(app)
      .post("/api/new")
      .send(jobData);
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject({
      error: [{ path: "companyName" }, { path: "companyEmail" }]
    });
  });

  it("Responds with job and company with valid data", async () => {
    const data = {
      position: faker.name.jobTitle(),
      jobType: "Full-time",
      city: faker.address.city(),
      tags: [faker.random.word()],
      monthlySalary: faker.finance.amount(),
      description: faker.lorem.sentences(),
      responsibilities: faker.lorem.sentences(),
      requirements: faker.lorem.sentence(),
      howToApply: faker.lorem.sentences(),
      applyUrl: faker.internet.url(),
      hasCompany: true,
      companyName: faker.company.companyName(),
      companyEmail: faker.internet.email()
    };
    const result = {
      company: {
        name: data.companyName,
        email: data.companyEmail
      },
      job: {
        position: data.position,
        jobType: data.jobType,
        city: data.city,
        tags: [{ name: data.tags[0], isPrimary: false }],
        monthlySalary: data.monthlySalary,
        description: data.description,
        responsibilities: data.responsibilities,
        howToApply: data.howToApply,
        applyUrl: data.applyUrl
      }
    };
    db.createJobAndCompany.mockResolvedValue(result);
    const response = await request(app)
      .post("/api/new")
      .send(data);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(result);
    expect(db.createJobAndCompany.mock.calls.length).toBe(1);
  });
});

describe("GET to /jobs", () => {
  const getSampleJob = () => {
    return {
      job: {
        position: faker.name.jobTitle(),
        jobType: "Full-time",
        description: faker.lorem.sentence(),
        apply_email: faker.internet.email()
      },
      company: null
    };
  };

  it("pagination works", async () => {
    const sampleJobs = Array.from({ length: 6 }, getSampleJob);
    db.getJobs
      .mockResolvedValueOnce(sampleJobs.slice(0, 3))
      .mockResolvedValueOnce(sampleJobs.slice(2, 5))
      .mockResolvedValueOnce(sampleJobs.slice(4, 6));
    const expectedCursors = [
      utils.base64encode(String(sampleJobs[2].job.id)),
      utils.base64encode(String(sampleJobs[4].job.id)),
      ""
    ];
    let nextCursor = "";
    for (let index = 0; index < 3; index++) {
      const response = await request(app).get(
        `/api/jobs?cursor=${nextCursor}&count=2`
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        jobs: sampleJobs.slice(index * 2, index * 2 + 2),
        nextCursor: expectedCursors[index]
      });
      nextCursor = response.body.nextCursor;
    }
    expect(db.getJobs.mock.calls.length).toBe(3);
  });
});
