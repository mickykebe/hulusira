const request = require("supertest");
const db = require("../db");
const { loadLoggedInUser } = require("./user-controller");
jest.mock("../db");

it("loadLoggedInUser middleware loads user if logged in.", async () => {
  const req = { session: { userId: 1 } };
  const next = jest.fn();
  db.getUserById.mockResolvedValue(Promise.resolve());
  await loadLoggedInUser(req, null, next);
  expect(db.getUserById.mock.calls.length).toBe(1);
  expect(next.mock.calls.length).toBe(1);
});
