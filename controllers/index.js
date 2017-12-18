// Loading the modules
var router = require("express").Router();

// Load the models
var ProjectsData = require("../models/projects");
    GameData = require("../models/gameData");

// Test intialisation of Founders Life Project.
router.get("/create/new/project/founder_life/mvp/setup", function(req, res) {

    // This is the default project.
    var project = {
        "project_id": "FoundersLifeAlpha",
        "title": "Founders Life",
        "developer": "Nell Watson",
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

router.post("/", function(req, res) {
    res.send("Cool. We are working. Now you can proceed to cry.");
});

// Load all the available API routes
//router.use("/", require("./v1"));
router.use("/v1", require("./v1"));

module.exports = router;
