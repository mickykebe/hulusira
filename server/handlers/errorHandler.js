exports.catchErrors = fn => ***REMOVED***
  return function(req, res, next) ***REMOVED***
    return fn(req, res, next).catch(next);
  ***REMOVED***;
***REMOVED***;

exports.notFound = (req, res, next) => ***REMOVED***
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
***REMOVED***;

exports.developmentErrors = (error, req, res, next) => ***REMOVED***
  console.log(error);
  res.status(error.status || 500);
  res.json(***REMOVED***
    errors: ***REMOVED***
      message: error.message,
      status: error.status,
      stackHighlighted: error.stack.replace(
        /[a-z_-\d]+.js:\d+:\d+/gi,
        "<mark>$&</mark>"
      )
    ***REMOVED***
  ***REMOVED***);
***REMOVED***;

exports.productionErrors = (err, req, res, next) => ***REMOVED***
  res.status(err.status || 500);
  res.json(***REMOVED***
    errors: ***REMOVED***
      message: err.message,
      error: ***REMOVED******REMOVED***
    ***REMOVED***
  ***REMOVED***);
***REMOVED***;
