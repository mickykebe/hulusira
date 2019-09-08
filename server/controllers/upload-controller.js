const multer = require("multer");
const gcsHelper = require("../handlers/googleCloudStorage");

const multerOptions = ***REMOVED***
  storage: multer.memoryStorage(),
  limits: ***REMOVED***
    fileSize: 5 * 1024 * 1024
  ***REMOVED***,
  fileFilter(_req, file, cb) ***REMOVED***
    const isPhoto = file.mimetype.startsWith("image/");
    if (isPhoto) ***REMOVED***
      cb(null, true);
    ***REMOVED*** else ***REMOVED***
      cb(***REMOVED*** message: "The file type isn't allowed!" ***REMOVED***, false);
    ***REMOVED***
  ***REMOVED***
***REMOVED***;

exports.uploadImage = [
  multer(multerOptions).single("image"),
  gcsHelper.upload,
  (req, res) => ***REMOVED***
    const data = req.body;
    if (req.file && req.file.cloudStoragePublicUrl) ***REMOVED***
      data.imageUrl = req.file.cloudStoragePublicUrl;
    ***REMOVED***
    res.send(data);
  ***REMOVED***
];
