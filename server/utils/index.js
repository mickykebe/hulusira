exports.base64encode = value => Buffer.from(value).toString("base64");

exports.base64decode = value => Buffer.from(value, "base64").toString("utf-8");

exports.isProduction = process.env.NODE_ENV === "production";

exports.tagIdsfromQueryParam = tags => ***REMOVED***
  return tags
    .split(",")
    .filter(tagId => tagId !== "" && !isNaN(Number(tagId)))
    .map(Number);
***REMOVED***;
