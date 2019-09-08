const multer = require("multer");
const gcsHelper = require("../handlers/googleCloudStorage");

const multerOptions = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter(_req, file, cb) {
    const isPhoto = file.mimetype.startsWith("image/");
    if (isPhoto) {
      cb(null, true);
    } else {
      cb({ message: "The file type isn't allowed!" }, false);
    }
  }
};

exports.uploadImage = [
  multer(multerOptions).single("image"),
  gcsHelper.upload,
  (req, res) => {
    const data = req.body;
    if (req.file && req.file.cloudStoragePublicUrl) {
      data.imageUrl = req.file.cloudStoragePublicUrl;
    }
    res.send(data);
  }
];
