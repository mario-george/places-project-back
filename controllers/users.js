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
const signup = (req, res, next) => {
  const { email, password, name } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input please check your data", 422));
  }
  const createdUser = {
    id: uuid.v4(),
    email: email,
    password: password,
    name: name,
  };
  DummyUsers.push(createdUser);
  res.status(201).json({ user: createdUser });
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
