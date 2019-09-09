const db = require('../db');

exports.loadUser = async (req, _res, next) => ***REMOVED***
  const userId = req.session.userId;
  if (userId) ***REMOVED***
    req.user = await db.getUserById(userId);
  ***REMOVED***
  next();
***REMOVED***;