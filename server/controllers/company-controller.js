const Yup = require("yup");
const db = require("../db");

const validationSchema = Yup.object().shape(***REMOVED***
  name: Yup.string().required("Required"),
  email: Yup.string()
    .email()
    .required("Required")
***REMOVED***);

exports.validateCompany = async (req, res, next) => ***REMOVED***
  const companyData = req.body;
  try ***REMOVED***
    await validationSchema.validate(companyData, ***REMOVED*** abortEarly: false ***REMOVED***);
  ***REMOVED*** catch (error) ***REMOVED***
    res.status(500).send(***REMOVED*** error: error.inner ***REMOVED***);
    return;
  ***REMOVED***
  next();
***REMOVED***;

exports.companies = async (req, res) => ***REMOVED***
  const owner = req.user.id;
  if (!owner) ***REMOVED***
    throw new Error("No company owner");
  ***REMOVED***
  const companies = await db.getCompanies(owner);
  res.status(200).send(companies);
***REMOVED***;

exports.getCompany = async (req, res) => ***REMOVED***
  const ***REMOVED*** companyId ***REMOVED*** = req.params;
  let company = await db.getCompany(companyId);
  if (!company) ***REMOVED***
    throw new Error("Company not found!");
  ***REMOVED***
  if (req.user && req.user.id === company.owner) ***REMOVED***
    res.status(200).send(company);
    return;
  ***REMOVED***
  const ***REMOVED*** owner, ...companyData ***REMOVED*** = company;
  res.status(200).send(companyData);
***REMOVED***;

exports.createCompany = async (req, res) => ***REMOVED***
  const data = req.body;
  const owner = req.user.id;
  const companyData = ***REMOVED*** owner, ...data ***REMOVED***;
  const company = await db.createCompany(companyData);
  res.status(200).send(company);
***REMOVED***;

exports.editCompany = async (req, res) => ***REMOVED***
  const ***REMOVED*** companyId ***REMOVED*** = req.params;
  const data = req.body;
  const ownerId = req.user.id;
  let company = await db.getCompany(companyId, ownerId);
  if (!company) ***REMOVED***
    throw new Error("Company not found");
  ***REMOVED***
  company = await db.updateCompany(companyId, ownerId, data);
  if (!company) ***REMOVED***
    throw new Error("Failed to update company");
  ***REMOVED***
  res.status(200).send(company);
***REMOVED***;

exports.deleteCompany = async (req, res) => ***REMOVED***
  const ***REMOVED*** companyId ***REMOVED*** = req.params;
  const ownerId = req.user.id;
  const numDeleted = await db.deleteCompany(companyId, ownerId);
  if (numDeleted !== 1) ***REMOVED***
    throw new Error("Problem occurred deleting company");
  ***REMOVED***
  res.sendStatus(200);
***REMOVED***;
