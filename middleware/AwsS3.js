const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const uuid = require("uuid");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
  sessionToken: process.env.AWS_SESSION_TOKEN,
});

const s3 = new aws.S3();

const mimeTypeMapperToExt = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "cyclic-cobalt-blue-seal-sock-ca-central-1",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const ext = mimeTypeMapperToExt[file.mimetype];
      cb(null, uuid.v4() + "." + ext);
    },
  }),
  fileFilter: (req, file, callback) => {
    const isValid = !!mimeTypeMapperToExt[file.mimetype];
    let error = isValid ? null : new Error("Wrong Mime Type detected");
    callback(error, isValid);
  },
});

module.exports = fileUpload;
