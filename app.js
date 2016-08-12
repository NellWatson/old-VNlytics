// We need these modules to be present.
var express = require("express");
    mongoose = require("mongoose");
    bodyParser = require("body-parser");
    morgan = require("morgan");

// Intialise exress
var app = express();

// When we respond with a json object, indent every block with 4 spaces.
app.set("json spaces", 4);

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

// Custom Error handling
app.use(function(req, res) {
   res.send('404: Page not Found', 404);
});

app.use(function(error, req, res, next) {
   res.send('500: Internal Server Error', 500);
});

// Start the server
app.listen(3000);
console.log("Server started on port 3000");
