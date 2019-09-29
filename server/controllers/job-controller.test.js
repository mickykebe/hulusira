const request = require("supertest");
const faker = require("faker");
const app = require("../app");
const db = require("../db");
const utils = require("../utils");
const { Job } = require("../models");
const {
  getJob,
  pendingJobs,
  approveJob,
  removeJob,
  permitJobAdmin,
  closeJob
} = require("./job-controller");
jest.mock("../db");

const mockRequest = ({ body = {}, params = {}, query = {} } = {}) => {
  return {
    params,
    body,
    query
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};

const sampleJobResult = (jobFields = {}, company = {}) => {
  return {
    job: Object.assign(
      new Job(),
      {
        position: faker.name.jobTitle(),
        jobType: "Full-time",
        description: faker.lorem.sentence(),
        apply_email: faker.internet.email(),
        closed: false,
        approved: true
      },
      jobFields
    ),
    company: { ...company }
  };
};

const sampleJobsResult = (numJobs = 5) => {
  return Array.from({ length: numJobs }, sampleJobResult);
};

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
      location: faker.address.city(),
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
        location: data.location,
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

describe("getJob middleware", () => {
  it("responds with 404 if job doesn't exist", async () => {
    const req = mockRequest({ params: { slug: faker.lorem.word() } });
    const res = mockResponse();
    db.getJobBySlug.mockResolvedValue(null);
    await getJob(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });

  it("responds with 404 if job is closed", async () => {
    const jobData = sampleJobResult({ closed: true });
    const req = mockRequest({ params: { slug: faker.lorem.word() } });
    const res = mockResponse();
    db.getJobBySlug.mockResolvedValue(jobData);
    await getJob(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });

  it("responds with 404 if job is not approved", async () => {
    const jobData = sampleJobResult({ approved: false });
    const req = mockRequest({ params: { slug: faker.lorem.word() } });
    const res = mockResponse();
    db.getJobBySlug.mockResolvedValue(jobData);
    await getJob(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });

  it("responds with job if it's available and active", async () => {
    const jobData = sampleJobResult();
    const req = mockRequest({ params: { slug: faker.lorem.word() } });
    const res = mockResponse();
    db.getJobBySlug.mockResolvedValue(jobData);
    await getJob(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(jobData);
  });

  it("responds with 404 for a closed job when adminToken doesn't check out", async () => {
    const jobData = sampleJobResult({
      closed: true,
      adminToken: faker.random.uuid()
    });
    const req = mockRequest({
      params: { slug: faker.lorem.word() },
      query: { adminToken: faker.random.uuid() }
    });
    const res = mockResponse();
    db.getJobBySlug.mockResolvedValue(jobData);
    await getJob(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });

  it("responds with job which is closed if adminToken checks out", async () => {
    const adminToken = faker.random.uuid();
    const jobData = sampleJobResult({ closed: true, adminToken });
    const req = mockRequest({
      params: { slug: faker.lorem.word() },
      query: { adminToken }
    });
    const res = mockResponse();
    db.getJobBySlug.mockResolvedValue(jobData);
    await getJob(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(jobData);
  });

  it("responds with job which is not approved if adminToken checks out", async () => {
    const adminToken = faker.random.uuid();
    const jobData = sampleJobResult({ approved: false, adminToken });
    const req = mockRequest({
      params: { slug: faker.lorem.word() },
      query: { adminToken }
    });
    const res = mockResponse();
    db.getJobBySlug.mockResolvedValue(jobData);
    await getJob(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(jobData);
  });
});

describe("GET /pending-jobs", () => {
  it("responds with pending jobs", async () => {
    const req = null;
    const res = mockResponse();
    const jobs = sampleJobsResult();
    db.getJobs.mockResolvedValue(jobs);
    await pendingJobs(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(jobs);
  });
});

describe("PUT /approve-job", () => {
  it("updates job and responds with true if job exists", async () => {
    const req = mockRequest({ body: { jobId: 1 } });
    const res = mockResponse();
    db.approveJob.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    await approveJob(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(true);
    await approveJob(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });
});

describe("closeJob middleware", () => {
  it("closes job and responds with true", async () => {
    const req = mockRequest({ params: { id: 1 } });
    const res = mockResponse();
    db.closeJob.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    await closeJob(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(true);
    await closeJob(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });
});

describe("DELETE /jobs/:jobId", () => {
  it("deletes job if it exists and responds with true", async () => {
    const req = mockRequest({ params: { jobId: 1 } });
    const res = mockResponse();
    db.deleteJob.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    await removeJob(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(true);
    await removeJob(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });
});

describe("permit jobAdmin middleware", () => {
  it("checks job admin access", async () => {
    const jobAdminToken = "secret-token";
    const req = mockRequest({
      params: { id: 1 },
      body: { adminToken: jobAdminToken }
    });
    const res = mockResponse();
    const next = jest.fn();
    db.getJobById
      .mockResolvedValueOnce({ job: { adminToken: jobAdminToken } })
      .mockResolvedValueOnce(null)
      .mockResolvedValue({ job: { adminToken: "another-secret-token" } });
    await permitJobAdmin(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    await permitJobAdmin(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    await permitJobAdmin(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    expect(res.sendStatus).toHaveBeenCalledTimes(2);
  });
});
