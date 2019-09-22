const db = require("../db");
const utils = require("../utils");

exports.getTags = async (req, res) => ***REMOVED***
  const ***REMOVED*** ids = "" ***REMOVED*** = req.query;
  const tagIds = utils.tagIdsfromQueryParam(ids);
  const tags = await db.getTags(tagIds);
  res.status(200).send(tags);
***REMOVED***;
