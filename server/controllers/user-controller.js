const bcrypt = require("bcryptjs");
const db = require("../db");

exports.me = async (req, res) => ***REMOVED***
  if (req.user) ***REMOVED***
    res.status(200).send(req.user.publicData());
    return;
  ***REMOVED***
  res.sendStatus(401);
***REMOVED***;

exports.login = async (req, res, next) => ***REMOVED***
  const ***REMOVED*** email, password ***REMOVED*** = req.body;
  const user = await db.getUserByEmail(email);
  if (user) ***REMOVED***
    const valid = await bcrypt.compare(password, user.password);
    if (valid && user.confirmed) ***REMOVED***
      req.session.userId = user.id;
      res.status(200).send(user.publicData());
      return;
    ***REMOVED***
  ***REMOVED***
  res.sendStatus(401);
***REMOVED***;
