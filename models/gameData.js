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
    play_data: [
        {
            type: mongoose.Schema.Types.Mixed
        }
    ]
});

var GameData = module.exports = mongoose.model("gameData", gameDataSchema);

function createPipeline(field, query) {
    if ( field == "choices" ) {
        return [
            {
                "$match": query
            },
            {
                "$unwind": "$play_data"
            },
            {
                "$group": {
                    "_id": {
                        "label": "$play_data.choices.label",
                        "caption": "$play_data.choices.caption"
                    },
                    "count": {
                        "$sum": 1
                    }
                }
            },
            {
                "$group": {
                    "_id": "$_id.label",
                    "Choices": { 
                        "$push": {
                            "Caption": "$_id.caption",
                            "Count": "$count"
                        }
                    }
                }
            },
            {
                "$project": {
                    "_id": 0, "Label": "$_id", "Choices": 1
                }
            }
        ];
    } else {
        return [
            {
                "$match": query
            },
            {
                "$group": {
                    "_id": {
                        value: "$data." + field
                    },
                    "count": {
                        "$sum": 1
                    }
                }
            }
        ];
    };
};

// Intialise Game ID
module.exports.addGameId = function(gameDataObj, callback) {
    GameData.create(gameDataObj, callback);
};

module.exports.getData = function(callback, limit) {
    GameData.find(callback).limit(limit);
};

module.exports.updateData = function(gameId, updatedObj, options, callback) {
    var query = { _id: gameId };
    var update = { $set: updatedObj };

    GameData.findOneAndUpdate(query, update, options, callback);
};

module.exports.updatePlayData = function(gameId, updatedObj, callback) {
    var query = {_id: gameId};
    var update = { $push: { "play_data": updatedObj } };
    var options = { $safe: true, upsert: true, new : true }

    GameData.findOneAndUpdate(query, update, options, callback);
};

module.exports.byId = function(query, callback) {
    GameData.findOne(query, callback);
};

module.exports.aggregateData = function( field, query, callback ) {
    var pipeline = createPipeline( field, query );

    GameData.aggregate( pipeline, callback );
};
