const {permit} = require('./permission');

const mockRequest = (user) => ({
  user: user,
});

const mockResponse = () => {
  const res = {};
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};

describe('permit middleware', () => {
  it("responds with status 403 if user isn't logged in", () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    const permitMiddleware = permit('admin');
    permitMiddleware(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it("responds with status 403 if user doesn't have a permitted role", () => {
    const req = mockRequest({ role: 'user' });
    const res = mockResponse();
    const next = jest.fn();
    const permitMiddleware = permit('admin');
    permitMiddleware(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it("calls the next middleware chain if logged in user has a permitted role", () => {
    const req = mockRequest({ role: 'admin' });
    const res = mockResponse();
    const next = jest.fn();
    const permitMiddleware = permit('admin');
    permitMiddleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});