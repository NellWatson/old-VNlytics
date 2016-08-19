// Loading the modules
var v1 = require("express").Router();
    bodyParser = require("body-parser");

// Load the models
var ProjectsData = require("../../models/projects");
    GameData = require("../../models/gameData");

// Use the bodyParser module for parsing response
v1.use( bodyParser.urlencoded({ extended: false }) );

v1.use("/:_projectId", function(req, res, next) {

    // Store the value of project id
    req._projectId = req.params._projectId;
    next();
});

v1.get("/stats", function(req, res) {
    ProjectsData.count( {}, function(err, c) {
        res.send(c + " Project(s) are registered with the site.");
    })
});

v1.get("/project", function(req, res) {
    ProjectsData.getData(function (err, projects) {
        if (err) {
            throw err;
        };
        res.json(projects);
    })
});

v1.post("/create", function(req, res) {
    var project = req.body;
    
    ProjectsData.addProject(project, function (err, project) {
        if (err) {
            throw err;
        };

        res.json(project);
    })
});

//Load the projects module
v1.use("/", require("./projects"));

//Load the game.data module
v1.use("/:_projectId", require("./game.data"));

v1.get("/", function(req, res) {
    res.send("Please provide a valid Project ID.");
});

module.exports = v1;
