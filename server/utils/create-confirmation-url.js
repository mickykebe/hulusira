const { v4 } = require("uuid");
const redis = require("../redis");

const confirmUserPrefix = "user-confirmation";

exports.confirmUserPrefix = confirmUserPrefix;

exports.createConfirmationUrl = async userId => {
  const token = v4();
  await redis.set(confirmUserPrefix + token, userId, "ex", 60 * 60 * 24);
  return `${process.env.ROOT_URL}/confirm/${token}`;
};
