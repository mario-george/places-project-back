const HttpError = require("../models/HttpError");
const uuid = require("uuid");
let DummyPlaces = [
  { id: "p1", title: "empire state building", creator: "u1" },
  { id: "p2", title: "grand prismatic building", creator: "u2" },
];

const getPlacesByUserId = (req, res, next) => {
  const { userID } = req.params;
  //   .find on an array will return the first element that pass the check
  /*  const place = DummyPlaces.find((place) => {
    return place.creator === userID;
  }); */

  const places = DummyPlaces.filter((p) => p.id === userID);
  if (!places || places.length === 0) {
    // return res.json({ message: "Place not found by this user" });
    const error = new HttpError("This user has no places found", 404);
    return next(error);
  } else {
    return res.json({ places });
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
    id: uuid.v4(),
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
const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const updatedPlace = { ...DummyPlaces.find((p) => p.id === req.params.pid) };
  //   the spread operator takes a copy of all key value pairs of the object

  const updatedPlaceIndex = DummyPlaces.findIndex(
    (p) => p.id === req.params.pid
  );
  updatedPlace.title = title;
  updatedPlace.description = description;
  //  we replaced the whole element of the array with the updated place
  DummyPlaces[updatedPlaceIndex] = updatedPlace;
  if (updatedPlaceIndex === -1) {
    return next(new HttpError("Could not find place with that id", 404));
  }
  return res.status(200).json({ message: "success", place: updatedPlace });
};
const deletePlace = (req, res, next) => {
  const deletedPlace = DummyPlaces.find((p) => p.id === req.params.pid);
  DummyPlaces = DummyPlaces.filter((p) => p.id !== req.params.pid);
  return res.status(200).json({ message: "success", place: deletedPlace });
};
exports.createPlace = createPlace;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.getAllPlaces = getAllPlaces;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
