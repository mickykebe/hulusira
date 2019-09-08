const connectRedis = require("connect-redis");
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const redis = require("./redis");
const routes = require("./routes/index");
const { isProduction } = require('./utils');

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
      httpOnly: true,
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
);

app.use(async (req, res, next) => {
  const userId = req.session.userId;
  if (userId) {
    req.user = await db.getUserById(userId);
  }
  next();
});
app.use("/api", routes);

module.exports = app;
