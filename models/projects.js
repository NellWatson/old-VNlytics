var mongoose = require("mongoose");
    mongoose.Promise = global.Promise;

var projectSchema = mongoose.Schema({
    project_id: {
        type: String,
        required: true,
        unique: true,
        minlength: 8,
        maxlength: 24
    },
    title: {
        type: String,
        required: true
    },
    developer: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image_url: {
        type: String
    },
    publisher: {
        type: String
    },
    engine: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

var ProjectsData = module.exports = mongoose.model("projectsData", projectSchema);

module.exports.addProject = function(project, callback) {
    ProjectsData.create(project, callback);
};

module.exports.getData = function(callback, limit) {
    ProjectsData.find(callback).limit(limit);
};

module.exports.updateData = function(pid, updatedObj, options, callback) {
    var query = {project_id: pid};
    var update = {$set: updatedObj};

    ProjectsData.findOneAndUpdate(query, update, options, callback);
};

module.exports.byId = function(query, callback) {
    ProjectsData.findOne(query, callback);
};
