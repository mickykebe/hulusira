const ***REMOVED*** Storage ***REMOVED*** = require("@google-cloud/storage");
const path = require("path");

const gcStorage = new Storage(***REMOVED***
  projectId: "hulusira",
  keyFilename: path.resolve(process.cwd(), "Hulusira-97ccaea38cdd.json")
***REMOVED***);

const bucketName = process.env.GCS_STATIC_BUCKET_NAME;
const bucket = gcStorage.bucket(bucketName);

function getPublicUrl(filename) ***REMOVED***
  if(process.env.BASE_STATIC_URL) ***REMOVED***
    return `$***REMOVED***process.env.BASE_STATIC_URL***REMOVED***/$***REMOVED***filename***REMOVED***`;
  ***REMOVED***
  return `https://storage.googleapis.com/$***REMOVED***bucketName***REMOVED***/$***REMOVED***filename***REMOVED***`;
***REMOVED***

exports.upload = (req, res, next) => ***REMOVED***
  if (!req.file) ***REMOVED***
    return next();
  ***REMOVED***

  const gcsFileName = Date.now() + req.file.originalname;
  const file = bucket.file(gcsFileName);

  const stream = file.createWriteStream(***REMOVED***
    metadata: ***REMOVED***
      contentType: req.file.mimetype
    ***REMOVED***
  ***REMOVED***);

  stream.on("error", err => ***REMOVED***
    console.error(err);
    req.file.cloudStorageError = err;
    next(err);
  ***REMOVED***);

  stream.on("finish", () => ***REMOVED***
    req.file.cloudStorageObject = gcsFileName;
    file.makePublic().then(() => ***REMOVED***
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsFileName);
      next();
    ***REMOVED***);
  ***REMOVED***);

  stream.end(req.file.buffer);
***REMOVED***;
