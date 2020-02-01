const { Storage } = require("@google-cloud/storage");
const path = require("path");

const gcStorage = new Storage({
  projectId: "hulusira",
  keyFilename: path.resolve(process.cwd(), "Hulusira-97ccaea38cdd.json")
});

const bucketName = process.env.GCS_STATIC_BUCKET_NAME;
const bucket = gcStorage.bucket(bucketName);

function getPublicUrl(filename) {
  if(process.env.BASE_STATIC_URL) {
    return `${process.env.BASE_STATIC_URL}/${filename}`;
  }
  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

exports.upload = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const gcsFileName = Date.now() + req.file.originalname;
  const file = bucket.file(gcsFileName);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on("error", err => {
    console.error(err);
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on("finish", () => {
    req.file.cloudStorageObject = gcsFileName;
    file.makePublic().then(() => {
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsFileName);
      next();
    });
  });

  stream.end(req.file.buffer);
};
