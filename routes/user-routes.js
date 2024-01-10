const express = require("express");
const { check } = require("express-validator");

const { fileUpload } = require("../middleware/AwsS3");
const router = express.Router();
const userController = require("../controllers/users");

router.get("/", userController.getAllUsers);
// middleware functions can take as many arguments and it will execute them from left to right
//
router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("password").isLength({ min: 5 }),
    check("email").normalizeEmail().isEmail(),
  ],

  userController.signup
);
router.post("/login", userController.login);
module.exports = router;
