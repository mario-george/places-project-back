const HttpError = require("../models/HttpError");
const uuid = require("uuid");
const DummyUsers = [
  {
    id: "u1",
    name: "Mario George",
    email: "mario@mario.com",
    password: "testpassword",
  },
];
const getAllUsers = (req, res, next) => {
  res.status(200).json({ users: DummyUsers });
};
const signup = (req, res, next) => {
  const { email, password, name } = req.body;
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
