const express = require("express");
const routes = require("./routes/index");
const { isProduction } = require("./utils");

const app = express();
if (isProduction) {
  app.set("trust proxy", true);
}
app.use("/api", routes);

module.exports = app;
