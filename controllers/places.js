const HttpError = require("../models/HttpError");
const DummyPlaces = [
  { id: "p1", title: "empire state building", creator: "u1" },
  { id: "p2", title: "grand prismatic building", creator: "u2" },
];

const getPlaceByUserId = (req, res, next) => {
  const { userID } = req.params;
  const place = DummyPlaces.find((place) => {
    return place.creator === userID;
  });
  if (!place) {
    // return res.json({ message: "Place not found by this user" });
    const error = new HttpError("Place from this user id is not found", 404);
    return next(error);
  } else {
    return res.json({ place });
  }
};
const getPlaceById = (req, res, next) => {
  const placeID = req.params.placeID;
  const place = DummyPlaces.find((place) => {
    return place.id === placeID;
  });
  //  sending more than one response will cause an error so you need to return which is return next(error) instead
  if (!place) {
    // return res.json({ message: "Place not found" });
    const error = new HttpError("Place with this id is not found", 404);
    return next(error);
  } else {
    return res.json({ place });
  }
};
const getAllPlaces = (req, res, next) => {
  return res.json({ places: DummyPlaces });
};
const createPlace = (req, res, next) => {
  const { title, address, creator, location, description } = req.body;
  const createdPlace = {
    title: title,
    address: address,
    creator: creator,
    location: location,
    description: description,
  };
  // default normal success  status code is 200
  // 201 means it created something successfully

  DummyPlaces.push(createdPlace);
  // unshift() will push the element at the first place of the array not the last like push

  res.status(201).json({ place: createdPlace });
};
exports.createPlace = createPlace;
exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.getAllPlaces = getAllPlaces;
