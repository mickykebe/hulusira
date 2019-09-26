const Redis = require("ioredis");
const utils = require("./utils");

module.exports = utils.isProduction
  ? new Redis(process.env.REDIS_URL)
  : new Redis();
