const db = require("../db");
const utils = require("../utils");

exports.getTags = async (req, res) => {
  const { ids = "" } = req.query;
  const tagIds = utils.tagIdsfromQueryParam(ids);
  const tags = await db.getTags(tagIds);
  res.status(200).send(tags);
};
