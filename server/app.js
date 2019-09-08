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
  session({
    store: new RedisStore({
      client: redis
    }),
    name: "qid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      domain: "http://localhost:3000",
      httpOnly: true,
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
);

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
  console.log(req.sessionID);
  const userId = req.session.userId;
  console.log({ userId });
  if (userId) {
    req.user = await db.getUserById(userId);
  }
  next();
});
app.use("/api", routes);

app.use(errorHandlers.notFound);
if (!isProduction) {
  app.use(errorHandlers.developmentErrors);
}

app.use(errorHandlers.productionErrors);

module.exports = app;
