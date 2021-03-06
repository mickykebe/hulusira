const connectRedis = require("connect-redis");
const cors = require("cors");
const session = require("express-session");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const errorHandlers = require("../handlers/errorHandler");
const companyController = require("../controllers/company-controller");
const jobController = require("../controllers/job-controller");
const uploadController = require("../controllers/upload-controller");
const userController = require("../controllers/user-controller");
const tagController = require("../controllers/tag-controller");
const telegramController = require("../controllers/telegram-controller");
const { catchErrors } = require("../handlers/errorHandler");
const { isProduction } = require("../utils");
const redis = require("../redis");
const { loadUser } = require("../handlers/loadUser");
const { permit, permitAuthenticated } = require("../handlers/permission");

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

router.put(
  "/jobs/:id",
  catchErrors(jobController.validateJobPost),
  catchErrors(jobController.editJob)
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
router.post("/jobs/:slug/page-open", catchErrors(jobController.openPage));
router.get("/jobs", catchErrors(jobController.getJobs));
router.get("/myjobs", permitAuthenticated(), catchErrors(jobController.myJobs));
router.get(
  "/pending-jobs",
  permit("admin"),
  catchErrors(jobController.pendingJobs)
);
router.get("/jobs/company/:id", catchErrors(jobController.companyJobs));
router.put(
  "/approve-job",
  permit("admin"),
  catchErrors(jobController.approveJob)
);

router.patch(
  "/jobs/:id/decline-job",
  permit("admin"),
  catchErrors(jobController.declineJob)
);
router.delete(
  "/jobs/:jobId",
  permit("admin"),
  catchErrors(jobController.removeJob)
);

router.post(
  "/company",
  permitAuthenticated(),
  catchErrors(companyController.validateCompany),
  catchErrors(companyController.createCompany)
);
router.get(
  "/company",
  permitAuthenticated(),
  catchErrors(companyController.companies)
);
router.get("/company/:companyId", catchErrors(companyController.getCompany));

router.put(
  "/company/:companyId",
  permitAuthenticated(),
  catchErrors(companyController.editCompany)
);
router.delete(
  "/company/:companyId",
  permitAuthenticated(),
  catchErrors(companyController.deleteCompany)
);

router.get("/primary-tags", catchErrors(jobController.getPrimaryTags));

router.get("/me", catchErrors(userController.me));
router.post("/login", catchErrors(userController.login));
router.post("/telegram-login", catchErrors(userController.telegramLogin));
router.post("/register", catchErrors(userController.register));
router.get(
  "/confirm-user/:confirmationKey",
  catchErrors(userController.confirmUser)
);
router.get("/logout", catchErrors(userController.logout));

router.get("/tags", catchErrors(tagController.getTags));

router.post(
  `/telegram/${process.env.TELEGRAM_BOT_TOKEN}`,
  catchErrors(telegramController.handleTelegramUpdate)
);

router.use(errorHandlers.notFound);
if (!isProduction) {
  router.use(errorHandlers.developmentErrors);
}

router.use(errorHandlers.productionErrors);

module.exports = router;
