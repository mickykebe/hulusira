exports.catchErrors = fn => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

exports.notFound = (req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
};

exports.developmentErrors = (error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    errors: {
      message: error.message,
      status: error.status,
      stackHighlighted: error.stack.replace(
        /[a-z_-\d]+.js:\d+:\d+/gi,
        "<mark>$&</mark>"
      )
    }
  });
};

exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
};
