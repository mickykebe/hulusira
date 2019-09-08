const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const jobController = require("../controllers/job-controller");
const uploadController = require("../controllers/upload-controller");
const userController = require("../controllers/user-controller");
const ***REMOVED*** catchErrors ***REMOVED*** = require("../handlers/errorHandler");

const router = express.Router();

router.use(logger("dev"));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded(***REMOVED*** extended: false ***REMOVED***));

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

module.exports = router;
