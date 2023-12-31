const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
// Loads the variables from .env into process.env

const userRoutes = require("./routes/user-routes");
const placesRoutes = require("./routes/places-routes");
const HttpError = require("./models/HttpError");

const app = express();

const url = process.env.DB_URI;
// load the uri Database Uniform Resource Identifier.

// app.use
// middleware for all incoming requests

// app.get app.post app.put app.delete app.patch
// middleware for specific http requests

// body-parser will parse the request body

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);

// default route not found error handler when other route called next(error)
app.use((req, res, next) => {
  const error = new HttpError("Couldn't find this route", 404);
  return next(error);
});

// errorHandler middleware function have 4 parameters the first is error
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
    // if you sent two responses it will cause error so we check if we sent a response if so we won't send a response again
  }
  return res
    .status(error.code || 404)
    .json({ message: error.message || "Error has occurred" });
});

mongoose
  .connect(url)
  .then(() => {
    // Port number
    const PORT = 5001;
    app.listen(PORT, () => {
      console.log(`Server is running and listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
