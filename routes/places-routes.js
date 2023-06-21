const express = require("express");
const router = express.Router();
// it takes a filter or route if it reaches the route it will execute the function in the second parameter
// REST API exchanges data with json format


router.get("/", (req, res, next) => {
    console.log("GET REQUEST")
    res.json({message:"GET REQUEST"})
});
