const db = require("../db");
const ***REMOVED*** loadUser ***REMOVED*** = require("./loadUser");
jest.mock("../db");

it("loadUser middleware loads user if logged in.", async () => ***REMOVED***
  const req = ***REMOVED*** session: ***REMOVED*** userId: 1 ***REMOVED*** ***REMOVED***;
  const next = jest.fn();
  db.getUserById.mockResolvedValue(Promise.resolve());
  await loadUser(req, null, next);
  expect(db.getUserById.mock.calls.length).toBe(1);
  expect(next.mock.calls.length).toBe(1);
***REMOVED***);
