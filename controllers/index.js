// Loading the modules
var router = require("express").Router();
    bodyParser = require("body-parser");

// Load the models
var ProjectsData = require("../models/projects");
    GameData = require("../models/gameData");

// Test intialisation of Founders Life Project.
router.use("/create/new/project/founder_life/first_run", function(req, res) {

    // This is the default project.
    var project = {
        "project_id": "FoundersLifeTest",
        "title": "Founders Life",
        "developer": "Nell Works",
        "engine": "Ren'Py"
        };
    
    ProjectsData.addProject(project, function (err, project) {
        if (err) {
            // If the Project Id already exists, inform the user
            if (err.name == "MongoError" && err.code == 11000) {
                return res.send({ succes: false, message: 'User already exist!' });
            }
            throw err;
        };

        res.json(project);
    })
});

// Load all the available API routes
//router.use("/", require("./v1"));
router.use("/v1", require("./v1"));

module.exports = router;
