const express = require("express");
const routes = require("./routes/index");
const ***REMOVED*** isProduction ***REMOVED*** = require("./utils");

const app = express();
if (isProduction) ***REMOVED***
  app.set("trust proxy", 1);
***REMOVED***
app.use("/api", routes);

module.exports = app;
