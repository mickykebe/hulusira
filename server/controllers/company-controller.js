const db = require("../db");

exports.createCompany = async (req, res) => ***REMOVED***
  const data = req.body;
  const owner = req.user.id;
  const companyData = ***REMOVED*** owner, ...data ***REMOVED***;
  const company = await db.createCompany(companyData);
  res.status(200).send(company);
***REMOVED***;
