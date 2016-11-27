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
    var allowedUpdate = [ "title", "developer" ];

    var updatedObj = helper.validatePost( allowedUpdate, req.body );

    if (helper.isEmpty(updatedObj)) {
        return res.send("Please send data to be updated with your request.");
    }

    ProjectsData.updateData( _projectId, updatedObj, {}, function (err, doc) {
        
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
v1.get("/:_projectId/platform", function(req, res) {
    var _query = { project_id: req.params._projectId };
    var _field = "platform";
    
    req.query = helper.sanitise(req.query);

    if ( "unique" in req.query ) {
        _query.multiple_ids = false;
    }

    if ( "render" in req.query ) {
        _query.display_render = req.query.renderer;
    }
    
    if ( "resolution" in req.query ) {
        if ( req.query.resolution === "full hd" ) {
            _query.display_size = "(1920, 1080)";
        } else if ( req.query.resolution === "hd" ) {
            _query.display_size = "(1280, 720)";
        } else {
            _query.display_size = req.query.resolution;
        }
    }

    GameData.aggregateData( _field, _query, function(err, doc) {
        res.send(doc);
    })
});

v1.get("/:_projectId/stats", function(req, res) {
    var _query = { project_id: req.params._projectId };
    var _field = "stats";

    GameData.aggregateData( _field, _query, function(err, doc) {

        if ( doc.length == 0 ) {
            res.json( {"count_days": 0, "count_money": 0} )
        } else {
            res.send(doc[0]);
        }
    })
});

v1.get("/:_projectId/summary", function(req, res) {
    var _query = { project_id: req.params._projectId, filled_form: true };
    var _field = "summary";

    GameData.aggregateData( _field, _query, function(err, doc) {

        if ( doc.length == 0 ) {
            res.json({
                "message": "No Data to display"
            });
        } else {
            res.send(doc[0]["Feedback Data"]);
        }
    })
});

v1.get("/:_projectId/player", function(req, res) {
    var _query = { project_id: req.params._projectId };
    var _field = "player";

    GameData.aggregateData( _field, _query, function(err, doc) {

        if ( doc.length == 0 ) {
            res.json({
                "message": "No Data to display"
            });
        } else {
            res.send(doc[0]);
        }
    })
});

v1.get("/:_projectId/:_queryKey", function(req, res) {
    var _field = req.params._queryKey;
    
    req.query = helper.sanitise(req.query);
    req.query.project_id = req.params._projectId;

    GameData.aggregateData( _field, req.query, function (err, project) {
        
        if (err) {
            throw err;
        };

        if ( project.length == 0 ) {
            res.json({
                "message": "No Data to display"
            });
        } else {
            res.json(project);
        }
    })
});

module.exports = v1;
