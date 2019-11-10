const withCSS = require("@zeit/next-css");
module.exports = withCSS({
  env: {
    ROOT_URL: process.env.ROOT_URL
  },
  experimental: { publicDirectory: true }
});
