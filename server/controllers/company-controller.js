const db = require("../db");

exports.createCompany = async (req, res) => {
  const data = req.body;
  const owner = req.user.id;
  const companyData = { owner, ...data };
  const company = await db.createCompany(companyData);
  res.status(200).send(company);
};
