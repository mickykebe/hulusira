const faker = require('faker');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const db = require("../db");
const ***REMOVED*** User ***REMOVED*** = require('../models');
const app = require("../app");
jest.mock("../db");

describe(`/login`, () => ***REMOVED***
  const email = faker.internet.email();
  const password = faker.internet.password();
  let user;
  beforeAll(async () => ***REMOVED***
    const hashedPassword = await bcrypt.hash(password, 15);
    user = new User(faker.random.number(), faker.name.firstName(), faker.name.lastName(), email, hashedPassword, true, faker.random.word());
  ***REMOVED***);
  it('wrong email returns 401', async () => ***REMOVED***
    const response = await request(app)
      .post("/api/login")
      .send(***REMOVED*** email: 'wrong email', password***REMOVED***);
    expect(response.statusCode).toBe(401);
  ***REMOVED***);

  it('corrent email but wrong password returns 401', async () => ***REMOVED***
    const response = await request(app)
      .post("/api/login")
      .send(***REMOVED*** email, password: 'wrong password'***REMOVED***);
    expect(response.statusCode).toBe(401);
  ***REMOVED***);

  it('correct email and password logs user in', async () => ***REMOVED***
    db.getUserByEmail.mockResolvedValue(user);
    const response = await request(app)
        .post("/api/login")
        .send(***REMOVED*** email, password ***REMOVED***);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(user.publicData());
  ***REMOVED***);
***REMOVED***);
