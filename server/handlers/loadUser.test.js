const db = require("../db");
const { loadUser } = require("./loadUser");
jest.mock("../db");

it("loadUser middleware loads user if logged in.", async () => {
  const req = { session: { userId: 1 } };
  const next = jest.fn();
  db.getUserById.mockResolvedValue(Promise.resolve());
  await loadUser(req, null, next);
  expect(db.getUserById.mock.calls.length).toBe(1);
  expect(next.mock.calls.length).toBe(1);
});
