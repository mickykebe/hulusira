const faker = require("faker");
const bcrypt = require("bcryptjs");
const db = require("../db");
const { User } = require("../models");
const { login } = require("./user-controller");
jest.mock("../db");
jest.mock("bcryptjs");

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
