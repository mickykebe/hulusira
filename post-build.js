const fs = require("fs");

fs.writeFile("./public/ads.txt", process.env.ADS_TXT, () => {});
