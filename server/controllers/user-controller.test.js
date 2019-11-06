const faker = require("faker");
const bcrypt = require("bcryptjs");
const db = require("../db");
const { User } = require("../models");
const { login, register, confirmUser } = require("./user-controller");
const sendEmailUtil = require("../utils/send-email");
const redis = require("../redis");

jest.mock("../redis");
jest.mock("../db");
jest.mock("bcryptjs");
jest.mock("../utils/create-confirmation-url");
jest.mock("../utils/send-email");

const mockRequest = ({
  body = {},
  params = {},
  query = {},
  session = {}
} = {}) => {
  return {
    params,
    body,
    query,
    session
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};

const sampleUser = (userData = {}) => {
  return Object.assign(new User(), userData);
};

describe(`/register`, () => {
  it("registers user and sends confirmation email", async () => {
    const req = mockRequest({ body: {} });
    const res = mockResponse();
    db.createUser.mockResolvedValue(new User());
    await register(req, res);
    expect(sendEmailUtil.sendEmail).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledTimes(1);
  });
});

describe("/confirm-user", () => {
  it("confirms a user if confirmation token", async () => {
    const req = mockRequest({ params: { token: faker.random.uuid() } });
    const res = mockResponse();
    const userId = faker.random.number();
    redis.get.mockResolvedValue(userId);
    await confirmUser(req, res);
    expect(db.confirmUser).toHaveBeenCalledWith(userId);
    expect(redis.del).toHaveBeenCalledTimes(1);
    expect(res.sendStatus).toHaveBeenCalledWith(200);
  });

  it("responds with status 500 for non-existent confirmation", async () => {
    const req = mockRequest({ params: { token: faker.random.uuid() } });
    const res = mockResponse();
    redis.get.mockResolvedValue(null);
    await confirmUser(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });
});

describe(`/login`, () => {
  it("wrong email returns 401", async () => {
    const req = mockRequest({
      body: { email: "wrong email", password: faker.internet.password() }
    });
    const res = mockResponse();
    db.getUserByEmail.mockResolvedValue(undefined);
    await login(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  it("corrent email but wrong password returns 401", async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const user = sampleUser({ email, password });
    const req = mockRequest({ body: { email, password: "wrong password" } });
    const res = mockResponse();
    db.getUserByEmail.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(false);
    await login(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  it("for uncofirmed user responds with 401", async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const user = sampleUser({ email, password, confirmed: false });
    const req = mockRequest({ body: { email, password } });
    const res = mockResponse();
    db.getUserByEmail.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    await login(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  it("works for confirmed user with correct email and password", async () => {
    const id = faker.random.number();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const user = sampleUser({ id, email, password, confirmed: true });
    const req = mockRequest({ body: { email, password } });
    const res = mockResponse();
    db.getUserByEmail.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(req.session.userId).toBe(id);
    expect(res.send).toHaveBeenCalledWith(user.publicData());
  });
});
