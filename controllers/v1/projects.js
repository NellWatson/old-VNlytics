// Load modules
var v1 = require("express").Router();
    bodyParser = require("body-parser");

// Load the models
var ProjectsData = require("../../models/projects");
    GameData = require("../../models/gameData");

// Load helper function
var helper = require("../../lib/helper");

// Use the bodyParser module for parsing response
v1.use(bodyParser.urlencoded({ extended: false }));

// If no Project ID is provided, tell the user to provide one.
v1.get("/", function(req, res) {
    res.send("Please provide a valid Project ID");
});

v1.post("/", function(req, res) {
    res.send("TODO: Allow people to create projects.")
});

// Check if we can find the project in our database
v1.get("/:_projectId", function(req, res) {
    var _projectId = req.params._projectId;

    ProjectsData.byId( { project_id: _projectId }, function (err, doc) {
        
        if (err) {
            throw err;
        };

        // Check whether the Project ID exists in our databse or not.
        if (! doc) {
            return res.send("This Project does not exist")
        };
        res.json(doc.title + " was found in our records.");
    })
});

v1.put("/:_projectId", function(req, res) {
    var _projectId = req.params._projectId;
    var allowedUpdate = ["title", "developer"];

    var updatedObj = helper.validatePost(allowedUpdate, req.body);

    if (helper.isEmpty(updatedObj)) {
        return res.send("Please send data to be updated with your request.");
    }

    ProjectsData.updateData(_projectId, updatedObj, {}, function (err, doc) {
        
        if (err) {
            throw err;
        };

        // Check whether the Project ID exists in our databse or not.
        if (! doc) {
            return res.send("This Project does not exist")
        };
        res.json(doc.title + " was found in our records.");
    })
});

// Send back the stats related to the game
v1.get("/:_projectId/stats", function(req, res) {
    ProjectsData.count( {engine: "Ren'Py"}, function(err, doc) {
        console.log('Count is ' + doc);
        res.send(doc + " count");
    })
});

module.exports = v1;
