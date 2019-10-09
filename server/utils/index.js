exports.base64encode = value => Buffer.from(value).toString("base64");

exports.base64decode = value => Buffer.from(value, "base64").toString("utf-8");

exports.isProduction = process.env.NODE_ENV === "production";

exports.tagIdsfromQueryParam = tags => {
  return tags
    .split(",")
    .filter(tagId => tagId !== "" && !isNaN(Number(tagId)))
    .map(Number);
};

exports.logAxiosErrors = error => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error", error.message);
  }
  console.log(error.config);
  throw error;
};
