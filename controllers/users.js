const uuid = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/HttpError");
const User = require("../models/user");

const DummyUsers = [
  {
    id: "u1",
    name: "Mario George",
    email: "mario@mario.com",
    password: "testpassword",
  },
];
const getAllUsers = async (req, res, next) => {
  let allUsers;
  try {
    allUsers = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Getting users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    allUsers: allUsers.map((user) => user.toObject({ getters: true })),
  });
};
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input please check your data", 422));
  }
  const { email, password, name, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }
  const createdUser = new User({
    email: email,
    password: password,
    name: name,
    places,
    image:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fin.cdgdbentre.edu.vn%2Frandom-anime-character-qbx135oe%2F&psig=AOvVaw1ciu2tyNyfhJBew5LB-gTZ&ust=1704191831767000&source=images&cd=vfe&ved=0CBIQjRxqFwoTCLjbj7n_u4MDFQAAAAAdAAAAABAJ",
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  const user = DummyUsers.find((u) => u.email === email);
  if (!user || user.password !== password) {
    return next(new HttpError("Wrong credentials please try again", 401));
    // 401 means auth failed
  }
  res.json({ message: "Login successful" });
};

exports.getAllUsers = getAllUsers;
exports.login = login;
exports.signup = signup;
