require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const logger = require("morgan");
const cors = require("cors");
const connectRedis = require("connect-redis");
const errorHandlers = require("./handlers/errorHandler");
const routes = require("./routes/index");
const redis = require("./redis");
const db = require("./db");

const isProduction = process.env.NODE_ENV === "production";

const RedisStore = connectRedis(session);

const app = express();

app.use(cors());
app.use(
  session(***REMOVED***
    store: new RedisStore(***REMOVED***
      client: redis
    ***REMOVED***),
    name: "qid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: ***REMOVED***
      domain: "http://localhost:3000",
      httpOnly: true,
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 24 * 7
    ***REMOVED***
  ***REMOVED***)
);

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(***REMOVED*** extended: false ***REMOVED***));

app.use(async (req, res, next) => ***REMOVED***
  console.log(req.sessionID);
  const userId = req.session.userId;
  console.log(***REMOVED*** userId ***REMOVED***);
  if (userId) ***REMOVED***
    req.user = await db.getUserById(userId);
  ***REMOVED***
  next();
***REMOVED***);
app.use("/api", routes);

app.use(errorHandlers.notFound);
if (!isProduction) ***REMOVED***
  app.use(errorHandlers.developmentErrors);
***REMOVED***

app.use(errorHandlers.productionErrors);

module.exports = app;
