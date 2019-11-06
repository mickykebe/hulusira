const ***REMOVED*** v4 ***REMOVED*** = require("uuid");
const redis = require("../redis");

const confirmUserPrefix = "user-confirmation";

exports.confirmUserPrefix = confirmUserPrefix;

exports.createConfirmationUrl = async userId => ***REMOVED***
  const token = v4();
  await redis.set(confirmUserPrefix + token, userId, "ex", 60 * 60 * 24);
  return `$***REMOVED***process.env.ROOT_URL***REMOVED***/confirm-user/$***REMOVED***token***REMOVED***`;
***REMOVED***;
