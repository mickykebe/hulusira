const db = require("../db");
const utils = require("../utils");

exports.getTags = async (req, res) => ***REMOVED***
  const ***REMOVED*** names = "" ***REMOVED*** = req.query;
  const tagNames = utils.tagNamesFromQueryParam(names);
  const tags = await db.getTags(tagNames);
  res.status(200).send(tags);
***REMOVED***;
