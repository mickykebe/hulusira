exports.permit = (...allowed) => ***REMOVED***
  const isAllowed = role => allowed.indexOf(role) > -1;

  return (req, res, next) => ***REMOVED***
    if(req.user && isAllowed(req.user.role)) ***REMOVED***
      next();
      return;
    ***REMOVED***
    res.sendStatus(403);
  ***REMOVED***
***REMOVED***