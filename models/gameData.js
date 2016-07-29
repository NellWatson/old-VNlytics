var mongoose = require("mongoose");
    mongoose.Promise = global.Promise;

var gameDataSchema = mongoose.Schema({
    project_id: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    display_render: {
        type: String,
        required: true
    },
    display_size: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date
    },
    play_time: {
        type: Number,
        default: 0
    },
    ending: {
        type: String
    },
    multiple_ids: {
        type: Boolean,
        default: false
    },
    filled_form: {
        type: Boolean
    },
    play_data: {
        type: mongoose.Schema.Types.Mixed
    }
});

var GameData = module.exports = mongoose.model("gameData", gameDataSchema);

// Intialise Game ID
module.exports.addGameId = function(gameDataObj, callback) {
    GameData.create(gameDataObj, callback);
};

module.exports.getData = function(callback, limit) {
    GameData.find(callback).limit(limit);
};

module.exports.updateData = function(gid, updatedObj, options, callback) {
    var query = {game_id: gid};
    var update = {$set: updatedObj};

    GameData.findOneAndUpdate(query, update, options, callback);
};

module.exports.byId = function(query, callback) {
    GameData.findOne(query, callback);
};
