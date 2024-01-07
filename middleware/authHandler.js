const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

const authHandler = (req, res, next) => {
  // there is a traditional action by the browser which it sends a request to the server to check if the server allows the request to be sent and attaching OPTIONS method to the request
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

    //continue to next middleware
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};

module.exports = authHandler;
