const express = require("express");
const router = express.Router();
// it takes a filter or route if it reaches the route it will execute the function in the second parameter
// REST API exchanges data with json format
const DummyPlaces = [
  { id: "p1", title: "empire state building", creator: "u1" },
  { id: "p2", title: "grand prismatic building", creator: "u2" },
];
/* router.get("/", (req, res, next) => {
  console.log("GET REQUEST");
  res.json({ message: "GET REQUEST" });
  // default response status is 200
}); */
// ctrl shift a multi line comment

router.get("/:placeID", (req, res, next) => {
  const placeID = req.params.placeID;
  const place = DummyPlaces.find((place) => {
    return place.id === placeID;
  });
  if (!place) {
    return res.json({ message: "Place not found" });
  } else {
    return res.json({ place });
  }
});
router.get("/user/:userID", (req, res, next) => {
  const { userID } = req.params;
  const place = DummyPlaces.find((place) => {
    return place.creator === userID;
  });
  if (!place) {
    return res.json({ message: "Place not found by this user" });
  } else {
    return res.json({ place });
  }
});
router.get("/", (req, res, next) => {
  return res.json({ places: DummyPlaces });
});
module.exports = router;
