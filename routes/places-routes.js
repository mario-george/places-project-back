const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const { fileUpload } = require("../middleware/AwsS3");
const placesController = require("../controllers/places");
const authHandler = require("../middleware/authHandler");
// it takes a filter or route if it reaches the route it will execute the function in the second parameter
// REST API exchanges data with json format

/* router.get("/", (req, res, next) => {
  console.log("GET REQUEST");
  res.json({ message: "GET REQUEST" });
  // default response status is 200
}); */
// ctrl shift a multi line comment

router.get("/:placeID", placesController.getPlaceById);
router.get("/user/:userID", placesController.getPlacesByUserId);

// the routes after this will require authentication with a valid token
router.use(authHandler);

router.get("/", placesController.getAllPlaces);
router.post(
  "/",
  fileUpload.single("image"),

  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesController.createPlace
);
router.patch(
  "/:pid",
  [check("description").isLength({ min: 5 }), check("title").not().isEmpty()],
  placesController.updatePlace
);
router.delete("/:pid", placesController.deletePlace);
module.exports = router;
