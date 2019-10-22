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
const ***REMOVED*** catchErrors ***REMOVED*** = require("../handlers/errorHandler");
const ***REMOVED*** isProduction ***REMOVED*** = require("../utils");
const redis = require("../redis");
const ***REMOVED*** loadUser ***REMOVED*** = require("../handlers/loadUser");
const ***REMOVED*** permit ***REMOVED*** = require("../handlers/permission");

const RedisStore = connectRedis(session);

const router = express.Router();

router.use(cors());
router.use(
  session(***REMOVED***
    store: new RedisStore(***REMOVED***
      client: redis
    ***REMOVED***),
    name: "qid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: ***REMOVED***
      httpOnly: true,
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 24 * 7
    ***REMOVED***
  ***REMOVED***)
);

router.use(loadUser);

router.use(logger("dev"));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded(***REMOVED*** extended: false ***REMOVED***));

router.post("/image-upload", uploadController.uploadImage);

router.post(
  "/new",
  catchErrors(jobController.validateJobPost),
  catchErrors(jobController.createJob)
);

router.post(
  "/jobs/:id/verify-token",
  catchErrors(jobController.permitJobAdmin),
  (req, res) => ***REMOVED***
    res.status(200).send(true);
  ***REMOVED***
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
if (!isProduction) ***REMOVED***
  router.use(errorHandlers.developmentErrors);
***REMOVED***

router.use(errorHandlers.productionErrors);

module.exports = router;
