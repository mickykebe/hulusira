const withCSS = require("@zeit/next-css");
module.exports = withCSS(***REMOVED***
  env: ***REMOVED***
    TELEGRAM_BOT_NAME: process.env.TELEGRAM_BOT_NAME,
    ROOT_URL: process.env.ROOT_URL
  ***REMOVED***,
  experimental: ***REMOVED*** publicDirectory: true ***REMOVED***
***REMOVED***);
