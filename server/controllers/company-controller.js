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

exports.createCompany = async (req, res) => {
  const data = req.body;
  const owner = req.user.id;
  const companyData = { owner, ...data };
  const company = await db.createCompany(companyData);
  res.status(200).send(company);
};
