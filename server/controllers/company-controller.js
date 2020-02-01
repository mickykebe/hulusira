const Yup = require("yup");
const db = require("../db");

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string()
    .email()
    .required("Required")
});

exports.validateCompany = async (req, res, next) => {
  const companyData = req.body;
  try {
    await validationSchema.validate(companyData, { abortEarly: false });
  } catch (error) {
    res.status(500).send({ error: error.inner });
    return;
  }
  next();
};

exports.companies = async (req, res) => {
  const owner = req.user.id;
  if (!owner) {
    throw new Error("No company owner");
  }
  const companies = await db.getCompanies(owner);
  res.status(200).send(companies);
};

exports.getCompany = async (req, res) => {
  const { companyId } = req.params;
  let company = await db.getCompany(companyId);
  if (!company) {
    throw new Error("Company not found!");
  }
  if (req.user && req.user.id === company.owner) {
    res.status(200).send(company);
    return;
  }
  const { owner, ...companyData } = company;
  res.status(200).send(companyData);
};

exports.createCompany = async (req, res) => {
  const data = req.body;
  const owner = req.user.id;
  const companyData = { owner, ...data };
  const company = await db.createCompany(companyData);
  res.status(200).send(company);
};

exports.editCompany = async (req, res) => {
  const { companyId } = req.params;
  const data = req.body;
  const ownerId = req.user.id;
  let company = await db.getCompany(companyId, ownerId);
  if (!company) {
    throw new Error("Company not found");
  }
  company = await db.updateCompany(companyId, ownerId, data);
  if (!company) {
    throw new Error("Failed to update company");
  }
  res.status(200).send(company);
};

exports.deleteCompany = async (req, res) => {
  const { companyId } = req.params;
  const ownerId = req.user.id;
  const numDeleted = await db.deleteCompany(companyId, ownerId);
  if (numDeleted !== 1) {
    throw new Error("Problem occurred deleting company");
  }
  res.sendStatus(200);
};
