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

exports.createCompany = async (req, res) => ***REMOVED***
  const data = req.body;
  const owner = req.user.id;
  const companyData = ***REMOVED*** owner, ...data ***REMOVED***;
  const company = await db.createCompany(companyData);
  res.status(200).send(company);
***REMOVED***;
