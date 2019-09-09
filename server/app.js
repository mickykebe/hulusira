const connectRedis = require("connect-redis");
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const redis = require("./redis");
const ***REMOVED***loadUser***REMOVED*** = require('./handlers/loadUser');
const routes = require("./routes/index");
const ***REMOVED*** isProduction ***REMOVED*** = require('./utils');

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
      httpOnly: true,
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 24 * 7
    ***REMOVED***
  ***REMOVED***)
);

app.use(loadUser);
app.use("/api", routes);

module.exports = app;
