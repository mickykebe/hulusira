exports.permit = (...allowed) => ***REMOVED***
  const isAllowed = role => allowed.indexOf(role) > -1;

  return (req, res, next) => ***REMOVED***
    const ***REMOVED*** user ***REMOVED*** = req;
    if (user && user.confirmed && isAllowed(user.role)) ***REMOVED***
      next();
      return;
    ***REMOVED***
    res.sendStatus(403);
  ***REMOVED***;
***REMOVED***;

exports.permitAuthenticated = () => ***REMOVED***
  return (req, res, next) => ***REMOVED***
    const ***REMOVED*** user ***REMOVED*** = req;
    if (user && user.confirmed) ***REMOVED***
      next();
      return;
    ***REMOVED***
    res.sendStatus(403);
  ***REMOVED***;
***REMOVED***;
