const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const HttpError = require("../models/HttpError");
const Place = require("../models/place");
const User = require("../models/user");
const getGeocodingData = require("../middleware/latLngExtraction");

const getPlacesByUserId = async (req, res, next) => {
  const { userID } = req.params;
  let userPopulatedWithPlaces;
  try {
    userPopulatedWithPlaces = await User.findById(userID).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Fetching places from the user failed, please try again later",
      500
    );
    return next(error);
  }
  if (!userPopulatedWithPlaces || userPopulatedWithPlaces.places.length === 0) {
    // return res.json({ message: "Place not found by this user" });
    const error = new HttpError("This user has no places found", 404);
    return next(error);
  }

  // mapped the array to use the toObject on each element of the places of the user
  res.json({
    places: userPopulatedWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};
const getPlaceById = async (req, res, next) => {
  const placeID = req.params.placeID;
  let place;
  try {
    place = await Place.findById(placeID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }
  //  sending more than one response will cause an error so you need to return which is return next(error) instead
  if (!place) {
    // return res.json({ message: "Place not found" });
    const error = new HttpError("Place with this id is not found", 404);
    return next(error);
  } else {
    return res.json({ place });
  }
};
const getAllPlaces = async (req, res, next) => {
  let places;
  try {
    places = await Place.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    const error = new HttpError("No places found", 404);
    return next(error);
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input please check your data", 422));
  }
  const { title, address, location, description } = req.body;
  // get lng and lat from the address
  let latLng;
  try {
    latLng = await getGeocodingData(address);
    console.log(latLng);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong , please try again.",
      500
    );
    return next(error);
  }

  if (latLng.latitude === undefined || latLng.longitude === undefined) {
    const error = new HttpError("Invalid Address, Enter a valid address.", 500);
    return next(error);
  }

  let imageURL = req.file?.location;
  if (process.env.DEV === "true") {
    imageURL = req.file?.path;
  }
  const createdPlace = new Place({
    // id: uuid.v4(), // will be generated by mongoose automatically
    title: title,
    address: address,
    creator: req.userData.userId,
    location: {
      lat: latLng.latitude || 0,
      lng: latLng.longitude || 0,
    },
    description: description,
    // multer image path
    // image: req.file.path,
    image: imageURL,
    //  aws s3 image path
  });

  // default normal success  status code is 200
  // 201 means it created something successfully

  // unshift() will push the element at the first place of the array not the last like push

  // check the _id of the creator is found in the collection of users or not

  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong , please try again.",
      500
    );
    return next(error);
  }
  if (!user) {
    return next(
      new HttpError("Could not find the creator by the given id.", 404)
    );
  }

  try {
    /* 
sessions and transactions are a way to do more than one thing at the same time if one fails the whole operations will fail
t error = new HttpError(
      "Something went wrong , please try again.",
*/
    console.log("start");
    const sess = await mongoose.startSession();
    await sess.startTransaction();
    await createdPlace.save({ session: sess });

    user.places.push(createdPlace);
    // mongoose won't push the whole js document like you would do using normal js arrays but only the _id of the place to the array

    await user.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    console.log(err);

    const error = new HttpError(
      "Something went wrong , please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input please check your data", 422));
  }
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(req.params.pid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }
  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit this place.", 401);
    return next(error);
  }
  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the place",
      500
    );
    return next(error);
  }
  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this place.",
      401
    );
    return next(error);
  }
  if (!place) {
    const error = new HttpError("Place not found for this id", 404);
    return next(error);
  }

  const creator = place.creator;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Removing the reference from the creator's 'places' array
    creator.places.pull(place);
    await creator.save({ session });

    // Removing the place itself
    await Place.deleteOne({ _id: placeId }).session(session);

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.log(err);
    const error = new HttpError(
      "Something went wrong while deleting the place",
      500
    );
    return next(error);
  }

  session.endSession();

  // fs.unlink(place.image, err => {
  //   console.log(err);
  // });
  res.status(200).json({ message: "Place Deleted" });
};

exports.createPlace = createPlace;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.getAllPlaces = getAllPlaces;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
