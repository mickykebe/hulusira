const Yup = require("yup");

const ***REMOVED*** jobTypes, careerLevels ***REMOVED*** = require("./index");

const requiredValidator = Yup.string().required("Required");

exports.positionValidator = requiredValidator;
exports.jobTypeValidator = Yup.string()
  .required("Required")
  .oneOf(jobTypes, "Invalid Job Type");
exports.careerLevelValidator = Yup.string()
  .required("Required")
  .oneOf(
    careerLevels.map(level => level.id),
    "Invalid Career Level"
  );
exports.deadlineValidator = Yup.date()
  .nullable()
  .default(null);
exports.descriptionValidator = requiredValidator;
exports.applyEmailValidator = Yup.string()
  .nullable()
  .notRequired()
  .email();
exports.companyNameValidator = requiredValidator;
exports.companyEmailValidator = Yup.string()
  .email()
  .required("Required");
