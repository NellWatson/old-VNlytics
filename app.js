// We need these modules to be present.
var express = require("express");
    mongoose = require("mongoose");
    bodyParser = require("body-parser");
    morgan = require("morgan");

// Intialise exress
var app = express();

// Use the bodyParser module for parsing response
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

// Connect to the MonogoDB database
mongoose.connect("mongodb://localhost:27017/test")
db = mongoose.conneection;

// Where should we look for the static files
app.use(express.static(__dirname + "/public"));

//Load the different routes
app.use(require("./controllers"));

// Start the server
app.listen(3000);
console.log("Server started on port 3000");
