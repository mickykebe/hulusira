const request = require("supertest");
const faker = require("faker");
const app = require("../app");
const db = require("../db");
const utils = require("../utils");
const ***REMOVED*** Job ***REMOVED*** = require("../models");
const ***REMOVED***
  getJob,
  pendingJobs,
  approveJob,
  removeJob,
  permitJobAdmin,
  closeJob
***REMOVED*** = require("./job-controller");
jest.mock("../db");

const mockRequest = (***REMOVED*** body = ***REMOVED******REMOVED***, params = ***REMOVED******REMOVED***, query = ***REMOVED******REMOVED*** ***REMOVED*** = ***REMOVED******REMOVED***) => ***REMOVED***
  return ***REMOVED***
    params,
    body,
    query
  ***REMOVED***;
***REMOVED***;

const mockResponse = () => ***REMOVED***
  const res = ***REMOVED******REMOVED***;
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
***REMOVED***;

const sampleJobResult = (jobFields = ***REMOVED******REMOVED***, company = ***REMOVED******REMOVED***) => ***REMOVED***
  return ***REMOVED***
    job: Object.assign(
      new Job(),
      ***REMOVED***
        position: faker.name.jobTitle(),
        jobType: "Full-time",
        description: faker.lorem.sentence(),
        apply_email: faker.internet.email(),
        closed: false,
        approved: true
      ***REMOVED***,
      jobFields
    ),
    company: ***REMOVED*** ...company ***REMOVED***
  ***REMOVED***;
***REMOVED***;

const sampleJobsResult = (numJobs = 5) => ***REMOVED***
  return Array.from(***REMOVED*** length: numJobs ***REMOVED***, sampleJobResult);
***REMOVED***;

describe("POST to /new", () => ***REMOVED***
  it("Validation error if position is missing", async () => ***REMOVED***
    const jobData = ***REMOVED***
      description: faker.name.jobDescriptor(),
      primaryTagId: 1,
      jobType: "Full-time",
      applyUrl: faker.internet.url()
    ***REMOVED***;
    const response = await request(app)
      .post("/api/new")
      .send(jobData);
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject(***REMOVED***
      error: [***REMOVED*** path: "position" ***REMOVED***]
    ***REMOVED***);
  ***REMOVED***);
  it("Validation error if description is missing", async () => ***REMOVED***
    const jobData = ***REMOVED***
      position: faker.name.jobTitle(),
      primaryTagId: 1,
      jobType: "Part-time",
      applyUrl: faker.internet.url()
    ***REMOVED***;
    const response = await request(app)
      .post("/api/new")
      .send(jobData);
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject(***REMOVED***
      error: [***REMOVED*** path: "description" ***REMOVED***]
    ***REMOVED***);
  ***REMOVED***);
  it("Validation error if job type is missing", async () => ***REMOVED***
    const jobData = ***REMOVED***
      position: faker.name.jobTitle(),
      description: faker.lorem.sentences(),
      primaryTagId: 1,
      applyUrl: faker.internet.url()
    ***REMOVED***;
    const response = await request(app)
      .post("/api/new")
      .send(jobData);
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject(***REMOVED***
      error: [***REMOVED*** path: "jobType" ***REMOVED***]
    ***REMOVED***);
  ***REMOVED***);
  it("Validation error if both primaryTag and tags are empty", async () => ***REMOVED***
    const jobData = ***REMOVED***
      position: faker.name.jobTitle(),
      description: faker.name.jobDescriptor(),
      jobType: "Freelance",
      applyUrl: faker.internet.url()
    ***REMOVED***;
    const response = await request(app)
      .post("/api/new")
      .send(jobData);
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject(***REMOVED***
      error: [***REMOVED*** path: "primaryTagId" ***REMOVED***, ***REMOVED*** path: "tags" ***REMOVED***]
    ***REMOVED***);
  ***REMOVED***);

  it("Validation error if both applyEmail and applyUrl are missing", async () => ***REMOVED***
    const jobData = ***REMOVED***
      position: faker.name.jobTitle(),
      description: faker.name.jobDescriptor(),
      jobType: "Internship",
      primaryTagId: 1
    ***REMOVED***;
    const response = await request(app)
      .post("/api/new")
      .send(jobData);
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject(***REMOVED***
      error: [***REMOVED*** path: "applyUrl" ***REMOVED***, ***REMOVED*** path: "applyEmail" ***REMOVED***]
    ***REMOVED***);
  ***REMOVED***);
  it("Validation error if hasCompany is true and company name and email are missing", async () => ***REMOVED***
    const jobData = ***REMOVED***
      position: faker.name.jobTitle(),
      description: faker.name.jobDescriptor(),
      jobType: "Temporary",
      primaryTagId: 1,
      applyUrl: faker.internet.url(),
      hasCompany: true
    ***REMOVED***;
    const response = await request(app)
      .post("/api/new")
      .send(jobData);
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject(***REMOVED***
      error: [***REMOVED*** path: "companyName" ***REMOVED***, ***REMOVED*** path: "companyEmail" ***REMOVED***]
    ***REMOVED***);
  ***REMOVED***);

  it("Responds with job and company with valid data", async () => ***REMOVED***
    const data = ***REMOVED***
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
    ***REMOVED***;
    const result = ***REMOVED***
      company: ***REMOVED***
        name: data.companyName,
        email: data.companyEmail
      ***REMOVED***,
      job: ***REMOVED***
        position: data.position,
        jobType: data.jobType,
        city: data.city,
        tags: [***REMOVED*** name: data.tags[0], isPrimary: false ***REMOVED***],
        monthlySalary: data.monthlySalary,
        description: data.description,
        responsibilities: data.responsibilities,
        howToApply: data.howToApply,
        applyUrl: data.applyUrl
      ***REMOVED***
    ***REMOVED***;
    db.createJobAndCompany.mockResolvedValue(result);
    const response = await request(app)
      .post("/api/new")
      .send(data);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(result);
    expect(db.createJobAndCompany.mock.calls.length).toBe(1);
  ***REMOVED***);
***REMOVED***);

describe("GET to /jobs", () => ***REMOVED***
  const getSampleJob = () => ***REMOVED***
    return ***REMOVED***
      job: ***REMOVED***
        position: faker.name.jobTitle(),
        jobType: "Full-time",
        description: faker.lorem.sentence(),
        apply_email: faker.internet.email()
      ***REMOVED***,
      company: null
    ***REMOVED***;
  ***REMOVED***;

  it("pagination works", async () => ***REMOVED***
    const sampleJobs = Array.from(***REMOVED*** length: 6 ***REMOVED***, getSampleJob);
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
    for (let index = 0; index < 3; index++) ***REMOVED***
      const response = await request(app).get(
        `/api/jobs?cursor=$***REMOVED***nextCursor***REMOVED***&count=2`
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(***REMOVED***
        jobs: sampleJobs.slice(index * 2, index * 2 + 2),
        nextCursor: expectedCursors[index]
      ***REMOVED***);
      nextCursor = response.body.nextCursor;
    ***REMOVED***
    expect(db.getJobs.mock.calls.length).toBe(3);
  ***REMOVED***);
***REMOVED***);

describe("getJob middleware", () => ***REMOVED***
  it("responds with 404 if job doesn't exist", async () => ***REMOVED***
    const req = mockRequest(***REMOVED*** params: ***REMOVED*** slug: faker.lorem.word() ***REMOVED*** ***REMOVED***);
    const res = mockResponse();
    db.getJobBySlug.mockResolvedValue(null);
    await getJob(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  ***REMOVED***);

  it("responds with 404 if job is closed", async () => ***REMOVED***
    const jobData = sampleJobResult(***REMOVED*** closed: true ***REMOVED***);
    const req = mockRequest(***REMOVED*** params: ***REMOVED*** slug: faker.lorem.word() ***REMOVED*** ***REMOVED***);
    const res = mockResponse();
    db.getJobBySlug.mockResolvedValue(jobData);
    await getJob(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  ***REMOVED***);

  it("responds with 404 if job is not approved", async () => ***REMOVED***
    const jobData = sampleJobResult(***REMOVED*** approved: false ***REMOVED***);
    const req = mockRequest(***REMOVED*** params: ***REMOVED*** slug: faker.lorem.word() ***REMOVED*** ***REMOVED***);
    const res = mockResponse();
    db.getJobBySlug.mockResolvedValue(jobData);
    await getJob(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  ***REMOVED***);

  it("responds with job if it's available and active", async () => ***REMOVED***
    const jobData = sampleJobResult();
    const req = mockRequest(***REMOVED*** params: ***REMOVED*** slug: faker.lorem.word() ***REMOVED*** ***REMOVED***);
    const res = mockResponse();
    db.getJobBySlug.mockResolvedValue(jobData);
    await getJob(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(jobData);
  ***REMOVED***);

  it("responds with 404 for a closed job when adminToken doesn't check out", async () => ***REMOVED***
    const jobData = sampleJobResult(***REMOVED***
      closed: true,
      adminToken: faker.random.uuid()
    ***REMOVED***);
    const req = mockRequest(***REMOVED***
      params: ***REMOVED*** slug: faker.lorem.word() ***REMOVED***,
      query: ***REMOVED*** adminToken: faker.random.uuid() ***REMOVED***
    ***REMOVED***);
    const res = mockResponse();
    db.getJobBySlug.mockResolvedValue(jobData);
    await getJob(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  ***REMOVED***);

  it("responds with job which is closed if adminToken checks out", async () => ***REMOVED***
    const adminToken = faker.random.uuid();
    const jobData = sampleJobResult(***REMOVED*** closed: true, adminToken ***REMOVED***);
    const req = mockRequest(***REMOVED***
      params: ***REMOVED*** slug: faker.lorem.word() ***REMOVED***,
      query: ***REMOVED*** adminToken ***REMOVED***
    ***REMOVED***);
    const res = mockResponse();
    db.getJobBySlug.mockResolvedValue(jobData);
    await getJob(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(jobData);
  ***REMOVED***);

  it("responds with job which is not approved if adminToken checks out", async () => ***REMOVED***
    const adminToken = faker.random.uuid();
    const jobData = sampleJobResult(***REMOVED*** approved: false, adminToken ***REMOVED***);
    const req = mockRequest(***REMOVED***
      params: ***REMOVED*** slug: faker.lorem.word() ***REMOVED***,
      query: ***REMOVED*** adminToken ***REMOVED***
    ***REMOVED***);
    const res = mockResponse();
    db.getJobBySlug.mockResolvedValue(jobData);
    await getJob(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(jobData);
  ***REMOVED***);
***REMOVED***);

describe("GET /pending-jobs", () => ***REMOVED***
  it("responds with pending jobs", async () => ***REMOVED***
    const req = null;
    const res = mockResponse();
    const jobs = sampleJobsResult();
    db.getJobs.mockResolvedValue(jobs);
    await pendingJobs(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(jobs);
  ***REMOVED***);
***REMOVED***);

describe("PUT /approve-job", () => ***REMOVED***
  it("updates job and responds with true if job exists", async () => ***REMOVED***
    const req = mockRequest(***REMOVED*** body: ***REMOVED*** jobId: 1 ***REMOVED*** ***REMOVED***);
    const res = mockResponse();
    db.approveJob.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    await approveJob(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(true);
    await approveJob(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  ***REMOVED***);
***REMOVED***);

describe("closeJob middleware", () => ***REMOVED***
  it("closes job and responds with true", async () => ***REMOVED***
    const req = mockRequest(***REMOVED*** params: ***REMOVED*** id: 1 ***REMOVED*** ***REMOVED***);
    const res = mockResponse();
    db.closeJob.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    await closeJob(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(true);
    await closeJob(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  ***REMOVED***);
***REMOVED***);

describe("DELETE /jobs/:jobId", () => ***REMOVED***
  it("deletes job if it exists and responds with true", async () => ***REMOVED***
    const req = mockRequest(***REMOVED*** params: ***REMOVED*** jobId: 1 ***REMOVED*** ***REMOVED***);
    const res = mockResponse();
    db.deleteJob.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    await removeJob(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(true);
    await removeJob(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  ***REMOVED***);
***REMOVED***);

describe("permit jobAdmin middleware", () => ***REMOVED***
  it("checks job admin access", async () => ***REMOVED***
    const jobAdminToken = "secret-token";
    const req = mockRequest(***REMOVED***
      params: ***REMOVED*** id: 1 ***REMOVED***,
      body: ***REMOVED*** adminToken: jobAdminToken ***REMOVED***
    ***REMOVED***);
    const res = mockResponse();
    const next = jest.fn();
    db.getJobById
      .mockResolvedValueOnce(***REMOVED*** job: ***REMOVED*** adminToken: jobAdminToken ***REMOVED*** ***REMOVED***)
      .mockResolvedValueOnce(null)
      .mockResolvedValue(***REMOVED*** job: ***REMOVED*** adminToken: "another-secret-token" ***REMOVED*** ***REMOVED***);
    await permitJobAdmin(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    await permitJobAdmin(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    await permitJobAdmin(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    expect(res.sendStatus).toHaveBeenCalledTimes(2);
  ***REMOVED***);
***REMOVED***);
