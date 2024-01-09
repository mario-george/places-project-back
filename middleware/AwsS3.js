const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require('uuid');
const multer = require("multer");
const multerS3 = require("multer-s3");

// Set the AWS Region
const REGION = process.env.AWS_REGION;

// Create an Amazon S3 service client object.
const s3 = new S3Client({ 
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  }
});

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
      cb(null, uuidv4() + "." + ext);
    },
  }),
  fileFilter: (req, file, callback) => {
    const isValid = !!mimeTypeMapperToExt[file.mimetype];
    let error = isValid ? null : new Error("Wrong Mime Type detected");
    callback(error, isValid);
  },
});

module.exports = fileUpload;
