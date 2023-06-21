const express = require("express");
const bodyParser = require("body-parser");
const placesRoutes = require("./routes/places-routes");
const app = express();
// middleware for all incoming requests
// app.use
// middleware for specific http requests
// app.get app.post app.put app.delete app.patch

// body-parser will parse the request body

app.use('/api/places',placesRoutes);
app.listen(3003);
