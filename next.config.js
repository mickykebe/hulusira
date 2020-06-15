const withCSS = require("@zeit/next-css");
module.exports = withCSS({
  env: {
    TELEGRAM_BOT_NAME: process.env.TELEGRAM_BOT_NAME,
    ROOT_URL: process.env.ROOT_URL,
    RECAPTCHA_KEY: process.env.RECAPTCHA_KEY,
  },
});
