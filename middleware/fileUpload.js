const multer = require("multer");
const uuid = require("uuid");



// multer (group of middlewares) takes a config object to set it
// dest: 'uploads/images' is a built in multer function that will create a folder called uploads and inside it a folder called images and will store the images there
const fileUpload = multer({
  destination: (req, file, callback) => {
    // specify destunation of the images
    callback(null, "uploads/images");
  },

});
/* 
limits:500000 is a built in multer function that will limit the size of the file to 500000 bytes

how data get stored
multer.diskStorage generate a driver
storage: multer.diskStorage({
*/
module.exports = fileUpload;
