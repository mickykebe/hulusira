const withCSS = require("@zeit/next-css");
module.exports = withCSS({
  env: {
    PORT: process.env.PORT,
    TELEGRAM_BOT_NAME: process.env.TELEGRAM_BOT_NAME,
    ROOT_URL: process.env.ROOT_URL
  },
  experimental: { publicDirectory: true }
});
