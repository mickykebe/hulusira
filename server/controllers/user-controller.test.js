const faker = require("faker");
const bcrypt = require("bcryptjs");
const db = require("../db");
const ***REMOVED*** User ***REMOVED*** = require("../models");
const ***REMOVED*** login ***REMOVED*** = require("./user-controller");
jest.mock("../db");
jest.mock("bcryptjs");

const mockRequest = (***REMOVED***
  body = ***REMOVED******REMOVED***,
  params = ***REMOVED******REMOVED***,
  query = ***REMOVED******REMOVED***,
  session = ***REMOVED******REMOVED***
***REMOVED*** = ***REMOVED******REMOVED***) => ***REMOVED***
  return ***REMOVED***
    params,
    body,
    query,
    session
  ***REMOVED***;
***REMOVED***;

const mockResponse = () => ***REMOVED***
  const res = ***REMOVED******REMOVED***;
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
***REMOVED***;

const sampleUser = (userData = ***REMOVED******REMOVED***) => ***REMOVED***
  return Object.assign(new User(), userData);
***REMOVED***;

describe(`/login`, () => ***REMOVED***
  it("wrong email returns 401", async () => ***REMOVED***
    const req = mockRequest(***REMOVED***
      body: ***REMOVED*** email: "wrong email", password: faker.internet.password() ***REMOVED***
    ***REMOVED***);
    const res = mockResponse();
    db.getUserByEmail.mockResolvedValue(undefined);
    await login(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  ***REMOVED***);

  it("corrent email but wrong password returns 401", async () => ***REMOVED***
    const email = faker.internet.email();
    const password = faker.internet.password();
    const user = sampleUser(***REMOVED*** email, password ***REMOVED***);
    const req = mockRequest(***REMOVED*** body: ***REMOVED*** email, password: "wrong password" ***REMOVED*** ***REMOVED***);
    const res = mockResponse();
    db.getUserByEmail.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(false);
    await login(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  ***REMOVED***);

  it("for uncofirmed user responds with 401", async () => ***REMOVED***
    const email = faker.internet.email();
    const password = faker.internet.password();
    const user = sampleUser(***REMOVED*** email, password, confirmed: false ***REMOVED***);
    const req = mockRequest(***REMOVED*** body: ***REMOVED*** email, password ***REMOVED*** ***REMOVED***);
    const res = mockResponse();
    db.getUserByEmail.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    await login(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  ***REMOVED***);

  it("works for confirmed user with correct email and password", async () => ***REMOVED***
    const id = faker.random.number();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const user = sampleUser(***REMOVED*** id, email, password, confirmed: true ***REMOVED***);
    const req = mockRequest(***REMOVED*** body: ***REMOVED*** email, password ***REMOVED*** ***REMOVED***);
    const res = mockResponse();
    db.getUserByEmail.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(req.session.userId).toBe(id);
    expect(res.send).toHaveBeenCalledWith(user.publicData());
  ***REMOVED***);
***REMOVED***);
