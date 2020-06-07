const fs = require("fs");

fs.writeFile("./public/ads.txt", process.env.ADS_TXT, () => {});
fs.writeFile("./credentials.json", process.env.GOOGLE_CREDENTIALS, () => {});
