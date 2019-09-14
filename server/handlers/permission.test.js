const ***REMOVED***permit***REMOVED*** = require('./permission');

const mockRequest = (user) => (***REMOVED***
  user: user,
***REMOVED***);

const mockResponse = () => ***REMOVED***
  const res = ***REMOVED******REMOVED***;
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
***REMOVED***;

describe('permit middleware', () => ***REMOVED***
  it("responds with status 403 if user isn't logged in", () => ***REMOVED***
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    const permitMiddleware = permit('admin');
    permitMiddleware(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  ***REMOVED***);

  it("responds with status 403 if user doesn't have a permitted role", () => ***REMOVED***
    const req = mockRequest(***REMOVED*** role: 'user' ***REMOVED***);
    const res = mockResponse();
    const next = jest.fn();
    const permitMiddleware = permit('admin');
    permitMiddleware(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  ***REMOVED***);

  it("calls the next middleware chain if logged in user has a permitted role", () => ***REMOVED***
    const req = mockRequest(***REMOVED*** role: 'admin' ***REMOVED***);
    const res = mockResponse();
    const next = jest.fn();
    const permitMiddleware = permit('admin');
    permitMiddleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  ***REMOVED***);
***REMOVED***);