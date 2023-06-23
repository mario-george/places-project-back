const express = require("express");
const bodyParser = require("body-parser");
const placesRoutes = require("./routes/places-routes");
const app = express();
// middleware for all incoming requests
// app.use
// middleware for specific http requests
// app.get app.post app.put app.delete app.patch

// body-parser will parse the request body

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);

// errorHandler middleware function have 4 parameters the first is error
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
    // if you sent two responses it will cause error so we check if we sent a response if so we won't send a response again
  }
  return res.status(error.code || 404).json(error.message || "Error has occurred");
});

app.listen(3003);
