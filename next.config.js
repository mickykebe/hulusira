const withCSS = require("@zeit/next-css");
module.exports = withCSS({
  target: "serverless",
  env: {
    serverUrl: `http://localhost:3000`
  }
});
