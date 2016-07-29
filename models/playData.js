var mongoose = require("mongoose");
    mongoose.Promise = global.Promise;

var playDataSchema = mongoose.Schema({
    project_id: {
        type: String,
        required: true
    },
    game_id: {
        type: String,
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed
    }
});

var PlayData = module.exports = mongoose.model("playData", playDataSchema);

function createPipeline(field, query) {
    console.log(field);
    if ( field == "choices" ) {
        return [
            {
                "$match": query
            },
            {
                "$group": {
                    "_id": {
                        "label": "$data.choices.label",
                        "caption": "$data.choices.caption"
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
module.exports.addPlayData = function(projectId, gameId, playDataObj, callback) {
    var obj = {
        project_id: projectId,
        game_id: gameId,
        data: playDataObj
    };

    PlayData.create(obj, callback);
};

module.exports.aggregateData = function( field, query, callback ) {
    console.log( field, query );
    var pipeline = createPipeline( field, query );

    PlayData.aggregate( pipeline, callback );
};
