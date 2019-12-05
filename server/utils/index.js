exports.base64encode = value => Buffer.from(value).toString("base64");

exports.base64decode = value => Buffer.from(value, "base64").toString("utf-8");

exports.isProduction = process.env.NODE_ENV === "production";

exports.tagNamesFromQueryParam = tags => ***REMOVED***
  return tags
    .split(",")
    .filter(tagName => !!tagName)
    .map(name => name.toUpperCase().trim());
***REMOVED***;

exports.logAxiosErrors = error => ***REMOVED***
  if (error.response) ***REMOVED***
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  ***REMOVED*** else if (error.request) ***REMOVED***
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  ***REMOVED*** else ***REMOVED***
    // Something happened in setting up the request that triggered an Error
    console.log("Error", error.message);
  ***REMOVED***
  console.log(error.config);
  throw error;
***REMOVED***;

const careerLevels = [
  ***REMOVED***
    id: "entry",
    label: "Entry Level (Fresh Graduate)"
  ***REMOVED***,
  ***REMOVED***
    id: "junior",
    label: "Junior Level (1-2 years experience)"
  ***REMOVED***,
  ***REMOVED***
    id: "mid",
    label: "Mid Level (2-5 years experience)"
  ***REMOVED***,
  ***REMOVED***
    id: "senior",
    label: "Senior Level (5+ years experience)"
  ***REMOVED***,
  ***REMOVED***
    id: "manager",
    label: "Managerial Level (Manager, Supervisor, Director)"
  ***REMOVED***,
  ***REMOVED***
    id: "executive",
    label: "Executive (VP, General Manager)"
  ***REMOVED***,
  ***REMOVED***
    id: "senior-executive",
    label: "Senior Executive (CEO, Country Manager, General Manager)"
  ***REMOVED***
];

exports.careerLevelLabel = function(careerLevel) ***REMOVED***
  const level = careerLevels.find(level => level.id === careerLevel);
  return level ? level.label : "";
***REMOVED***;
