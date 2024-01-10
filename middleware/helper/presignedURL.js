const {
  S3Client,
  GetObjectCommand,
  createPresignedPost,
} = require("@aws-sdk/client-s3");
async function getFile(url) {
  const command = new GetObjectCommand({
    Bucket: "cyclic-cobalt-blue-seal-sock-ca-central-1",
    Key: url.split(".amazonaws.com/")[1],
  });

  const signedUrl = await s3.getSignedUrl(command, { expiresIn: 3600 }); // URL expires in 1 hour
  return signedUrl;
}
module.exports = getFile;
