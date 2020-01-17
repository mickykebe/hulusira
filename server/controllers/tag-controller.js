const db = require("../db");
const utils = require("../utils");

exports.getTags = async (req, res) => {
  const { names = "" } = req.query;
  const tagNames = utils.parseTags(names);
  const tags = await db.getTags(tagNames);
  res.status(200).send(tags);
};
