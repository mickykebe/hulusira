const express = require("express");
const routes = require("./routes/index");
const { isProduction } = require("./utils");

const app = express();
if (isProduction) {
  app.set("trust proxy", 2);
}
app.use("/api", routes);

module.exports = app;
