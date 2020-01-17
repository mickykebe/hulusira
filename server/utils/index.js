exports.base64encode = value => Buffer.from(value).toString("base64");

exports.base64decode = value => Buffer.from(value, "base64").toString("utf-8");

exports.isProduction = process.env.NODE_ENV === "production";

exports.parseTags = tagsStr => {
  return tagsStr
    .split(",")
    .filter(tagName => !!tagName)
    .map(name => name.toUpperCase().trim());
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

exports.jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Temporary"
];

const careerLevels = [
  {
    id: "entry",
    label: "Entry Level (Fresh Graduate)"
  },
  {
    id: "junior",
    label: "Junior Level (1+ - 2 years experience)"
  },
  {
    id: "mid",
    label: "Mid Level (2+ - 5 years experience)"
  },
  {
    id: "senior",
    label: "Senior Level (5+ years experience)"
  },
  {
    id: "manager",
    label: "Managerial Level (Manager, Supervisor, Director)"
  },
  {
    id: "executive",
    label: "Executive (VP, General Manager)"
  },
  {
    id: "senior-executive",
    label: "Senior Executive (CEO, Country Manager, General Manager)"
  }
];

exports.careerLevels = careerLevels;

exports.careerLevelLabel = function(careerLevel) {
  const level = careerLevels.find(level => level.id === careerLevel);
  return level ? level.label : "";
};

exports.jobUrlFromSlug = function(slug) {
  return `${process.env.ROOT_URL}/jobs/${slug}`;
};
