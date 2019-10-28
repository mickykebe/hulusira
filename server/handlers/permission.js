exports.permit = (...allowed) => {
  const isAllowed = role => allowed.indexOf(role) > -1;

  return (req, res, next) => {
    const { user } = req;
    if (user && user.confirmed && isAllowed(user.role)) {
      next();
      return;
    }
    res.sendStatus(403);
  };
};

exports.permitAuthenticated = () => {
  return (req, res, next) => {
    const { user } = req;
    if (user && user.confirmed) {
      next();
      return;
    }
    res.sendStatus(403);
  };
};
