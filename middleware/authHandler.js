const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

const authHandler = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    // token must be sent from the front-end by attaching in the headers object { Authorization: 'Bearer TOKEN'}
    // headers properties are case insensitive

    const token = req.headers.authorization.split(" ")[1]; 
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const tokenDecoded = jwt.verify(token, process.env.JWT_KEY);
    
    // attach a property to the request object that contains the user's ID 
    req.userData = { userId: tokenDecoded.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};

module.exports = authHandler;
