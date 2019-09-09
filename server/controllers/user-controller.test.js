const faker = require('faker');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const db = require("../db");
const { User } = require('../models');
const app = require("../app");
jest.mock("../db");

describe(`/login`, () => {
  const email = faker.internet.email();
  const password = faker.internet.password();
  let user;
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash(password, 15);
    user = new User(faker.random.number(), faker.name.firstName(), faker.name.lastName(), email, hashedPassword, true, faker.random.word());
  });
  it('wrong email returns 401', async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ email: 'wrong email', password});
    expect(response.statusCode).toBe(401);
  });

  it('corrent email but wrong password returns 401', async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ email, password: 'wrong password'});
    expect(response.statusCode).toBe(401);
  });

  it('correct email and password logs user in', async () => {
    db.getUserByEmail.mockResolvedValue(user);
    const response = await request(app)
        .post("/api/login")
        .send({ email, password });
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(user.publicData());
  });
});
