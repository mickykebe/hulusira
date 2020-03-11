const express = require("express");
const routes = require("./routes/index");
const { isProduction } = require("./utils");

const app = express();
app.use("/api", routes);

module.exports = app;
