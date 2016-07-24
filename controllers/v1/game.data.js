var v1 = require("express").Router();
    bodyParser = require("body-parser");

// Load the models
var ProjectsData = require("../../models/projects");
    GameData = require("../../models/gameData");
    PlayData = require("../../models/playData");

// Load helper function
var helper = require("../../lib/helper");

// Use the bodyParser module for parsing response
v1.use(bodyParser.urlencoded({ extended: false }));

// Check if we can find the game id in our database
v1.get("/:_gameId", function(req, res) {
    var _gameId = req.params._gameId;

    GameData.byId( { game_id: _gameId }, function (err, doc) {
        
        if (err) {
            throw err;
        };

        // Check whether the Game ID exists in our databse or not.
        if (! doc) {
            return res.send("This Game ID does not exist")
        };
        res.json(doc.game_id + " was found in our records.");
    })
});

// Create a new Game ID.
v1.post("/", function(req, res) {

    // If the project_id isn't provided, return with an error.
    if ( !("project_id" in req.body) ) {
        return res.send("You need to provide Project ID");
    }

    // Check if the Project ID is in the file.
    helper.documentExists( ProjectsData, {project_id: req.body.project_id} )
        .then(function(c) {
            if ( c == 0 ) {
                return res.send("The provided Project Id does not exist in our database.");
            } else {
                var gameDataObj = req.body;
                
                GameData.addGameId(gameDataObj, function (err, doc) {
                    if (err) {
                        if (err.name == "ValidationError") {
                            return res.send("Please send all the required details.");
                        }
                        throw err;
                    };

                    res.json(doc);
              })
        };
    });
});

v1.post("/:_gameId", function(req, res) {
    var _gameId = req.params._gameId;
    var postObj = req.body;

    helper.documentExists( GameData, {game_id: _gameId} )
        .then(function(c) {
            if ( c == 0 ) {
                return res.send("The provided Game Id does not exist in our database.");
            } else {

                PlayData.addPlayData( postObj, function (err, doc) {
                    
                    if (err) {
                        throw err;
                    };

                    res.json(doc.game_id + " was found in our records.");
                })
        };
    });
});

module.exports = v1;
