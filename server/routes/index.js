const connectRedis = require("connect-redis");
const cors = require("cors");
const session = require("express-session");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const errorHandlers = require("../handlers/errorHandler");
const jobController = require("../controllers/job-controller");
const uploadController = require("../controllers/upload-controller");
const userController = require("../controllers/user-controller");
const tagController = require("../controllers/tag-controller");
const { catchErrors } = require("../handlers/errorHandler");
const { isProduction } = require("../utils");
const redis = require("../redis");
const { loadUser } = require("../handlers/loadUser");
const { permit } = require("../handlers/permission");

const RedisStore = connectRedis(session);

const router = express.Router();

router.use(cors());
router.use(
  session({
    store: new RedisStore({
      client: redis
    }),
    name: "qid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
);

router.use(loadUser);

router.use(logger("dev"));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post("/image-upload", uploadController.uploadImage);

router.post(
  "/new",
  catchErrors(jobController.validateJobPost),
  catchErrors(jobController.createJob)
);

router.post(
  "/jobs/:id/verify-token",
  catchErrors(jobController.permitJobAdmin),
  (req, res) => {
    res.status(200).send(true);
  }
);
router.patch(
  "/jobs/:id/close-job",
  catchErrors(jobController.permitJobAdmin),
  catchErrors(jobController.closeJob)
);
router.get("/jobs/:slug", catchErrors(jobController.getJob));
router.get("/jobs", catchErrors(jobController.getJobs));
router.get(
  "/pending-jobs",
  permit("admin"),
  catchErrors(jobController.pendingJobs)
);
router.put(
  "/approve-job",
  permit("admin"),
  catchErrors(jobController.approveJob)
);
router.delete(
  "/jobs/:jobId",
  permit("admin"),
  catchErrors(jobController.removeJob)
);
router.get("/primary-tags", catchErrors(jobController.getPrimaryTags));

router.get("/me", catchErrors(userController.me));
router.post("/login", catchErrors(userController.login));
router.post("/register", catchErrors(userController.register));
router.get(
  "/confirm-user/:confirmationKey",
  catchErrors(userController.confirmUser)
);

router.get("/tags", catchErrors(tagController.getTags));

router.use(errorHandlers.notFound);
if (!isProduction) {
  router.use(errorHandlers.developmentErrors);
}

router.use(errorHandlers.productionErrors);

module.exports = router;
