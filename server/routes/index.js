const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const errorHandlers = require("../handlers/errorHandler");
const jobController = require("../controllers/job-controller");
const uploadController = require("../controllers/upload-controller");
const userController = require("../controllers/user-controller");
const { catchErrors } = require("../handlers/errorHandler");
const { isProduction } = require('../utils');

const router = express.Router();

router.use(logger("dev"));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post("/image-upload", uploadController.uploadImage);

router.post(
  "/new",
  catchErrors(jobController.validateJobPost),
  catchErrors(jobController.createJob)
);

router.get("/jobs/:jobId", catchErrors(jobController.getJob));
router.get("/jobs", catchErrors(jobController.getJobs));
router.get("/primary-tags", catchErrors(jobController.getPrimaryTags));

router.get("/me", catchErrors(userController.me));
router.post("/login", catchErrors(userController.login));

router.use(errorHandlers.notFound);
if (!isProduction) {
  router.use(errorHandlers.developmentErrors);
}

router.use(errorHandlers.productionErrors);

module.exports = router;
