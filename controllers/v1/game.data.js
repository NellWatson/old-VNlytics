var v1 = require("express").Router();
    bodyParser = require("body-parser");
    morgan = require("morgan");

// Load the models
var ProjectsData = require("../../models/projects");
    GameData = require("../../models/gameData");

// Load helper function
var helper = require("../../lib/helper");

// Use the bodyParser module for parsing response
v1.use(bodyParser.json());
v1.use(morgan("dev"));

// Check if we can find the game id in our database
v1.get("/:_gameId", function(req, res) {
    var _gameId = req.params._gameId;

    GameData.byId( { _id: _gameId }, function (err, doc) {
        
        if (err) {
            throw err;
        };

        // Check whether the Game ID exists in our databse or not.
        if (! doc) {
            return res.send("This Game ID does not exist")
        };

        res.json(doc._id + " was found in our records.");
    })
});

// Check if we can find the game id in our database
v1.get("/:_gameId/get", function(req, res) {
    var _gameId = req.params._gameId;

    console.log("Check");

    GameData.byId( { _id: _gameId }, function (err, doc) {
        
        if (err) {
            throw err;
        };

        // Check whether the Game ID exists in our databse or not.
        if (! doc) {
            return res.send("This Game ID does not exist")
        };

        console.log(req.project_id)

        res.json(doc.play_data);
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
                
                var gameDataObj = helper.sanitise(req.body);
                
                GameData.addGameId( gameDataObj, function (err, doc) {

                    if (err) {
                        if ( err.name == "ValidationError" ) {
                            return res.send("Please send all the required details.");
                        } else if ( err.name == "MongoError" && err.code == 11000 ) {
                            return res.send("Please provide a unique game ID");
                        }
                        throw err;
                    };

                    res.send(doc._id);
                })
            };
        });
});

v1.post("/:_gameId", function(req, res) {
    var _gameId = req.params._gameId;
    var postObj = helper.sanitise(req.body);

    helper.documentExists( GameData, { _id: _gameId } )
        .then(function(c) {
            if ( c == 0 ) {
                return res.send("The provided Game Id does not exist in our database.");
            } else {

                GameData.updatePlayData( _gameId, postObj, function(err, doc) {
                    
                    if (err && err.name === "MongoError" && err.code === 11000) {
                        res.send("This game entry has already been filled!");
                    } else if (err) {
                        throw err;
                    };

                    if (doc) {
                        res.json(doc._id + " was added to our records.");
                    } else {
                        throw err;
                    };
                })
            };
        })

        .catch(function(err) {
            if (err.name == "CastError" && err.kind == "ObjectId") {
                res.send("Please use a valid ID");
            }
        });
});

v1.post("/:_gameId/form", function(req, res) {
    req.body = helper.sanitise(req.body);

    var _gameId = req.params._gameId;

    helper.documentExists( GameData, { _id: _gameId } )
        .then(function(c) {
            if ( c == 0 ) {
                return res.send("The provided Game Id does not exist in our database");
            } else {

                GameData.addFormData( _gameId, req.body, function(err, doc) {

                    if (err && err.name === "MongoError" && err.code === 11000) {
                        res.send("This form has already been filled!");
                    } else if (err) {
                        throw err;
                    };

                    if (doc) {
                        res.json("Thank you for your feedback.");
                    }
                })
            }
        })

        .catch(function(err) {
            if (err.name === "CastError" && err.kind === "ObjectId") {
                res.send("Please use a valid ID.");
            };
        });
})

v1.post("/:_gameId/end", function(req, res) {
    var allowedUpdate = [ "play_time", "ending", "filled_form", "final_game_pass" ];
    req.body = helper.sanitise(req.body);

    var _gameId = req.params._gameId;
    var updatedObj = helper.validatePost( allowedUpdate, req.body );

    if ( helper.isEmpty(updatedObj) ) {
        return res.send("Please send data to be updated with your request.");
    }

    console.log("Check");

    updatedObj["end_date"] = new Date().toISOString();

    helper.documentExists( GameData, { _id: _gameId } )
        .then(function(c) {
            if ( c == 0 ) {
                return res.send("The provided Game Id does not exist in our database");
            } else {

                GameData.updateData( _gameId, updatedObj, {}, function(err, doc) {

                    if (err) {
                        console.log(err.name);
                        throw err;
                    };

                    res.json(_gameId + " is marked as finished.");
                })
            }
        })

        .catch(function(err) {
            if (err.name == "CastError" && err.kind == "ObjectId") {
                res.send("Please use a valid ID.");
            }
        });
})

module.exports = v1;
