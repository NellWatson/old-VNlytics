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
    sessions: {
        type: Number,
        default: 0
    },
    sessions_length: [
    ],
    multiple_ids: {
        type: Boolean,
        default: false
    },
    filled_form: {
        type: Boolean,
        default: false
    },
    ending: {
        type: String
    },
    form_data: {
        overall: {
            type: Number,
            min: 0,
            max: 2
        },
        ease: {
            type: Number,
            min: 0,
            max: 2
        },
        gameplay: {
            type: Number,
            min: 0,
            max: 2
        },
        story: {
            type: Number,
            min: 0,
            max: 2
        },
        graphics: {
            type: Number,
            min: 0,
            max: 2
        },
        sound: {
            type: Number,
            min: 0,
            max: 2
        },
        liked: {
            type: String
        },
        not_liked: {
            type: String
        },
        more_of: {
            type: String
        },
        less_of: {
            type: String
        },
        one_change: {
            type: String
        },
        email: {
            type: String
        },
        extra_questions: {
            type: mongoose.Schema.Types.Mixed
        }
    },
    play_data: [
        {
            type: mongoose.Schema.Types.Mixed
        }
    ],
    end_data: [
        {
            type: mongoose.Schema.Types.Mixed
        }
    ]
});

var GameData = module.exports = mongoose.model("gameData", gameDataSchema);

function createPipeline(field, query) {
    if ( field === "choices" ) {
        return [
            {
                "$match": query
            },
            {
                "$unwind": "$play_data"
            },
            {
                "$unwind": "$play_data.choices"
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
                    "choices": { 
                        "$push": {
                            "caption": "$_id.caption",
                            "count": "$count"
                        }
                    }
                }
            },
            {
                "$project": {
                    "_id": 0, "label": "$_id", "choices": 1
                }
            }
        ];
    } else if ( [ "platform", "display_render", "display_size" ].indexOf(field) > -1 ) {
        return [
            {
                "$match": query
            },
            {
                "$group": {
                    "_id": "$" + field,
                    "count": {
                        "$sum": 1
                    }
                }
            }
        ];
    } else if ( field === "summary" ) {
        return [
            {
                "$match": query
            },
            {
                "$group": {
                    "_id": "_id",
                    "Feedback Data": {
                        "$push": {
                            "Player ID": "$_id",
                            "Overall Experience": "$form_data.overall",
                            "Ease of Use": "$form_data.ease",
                            "Gameplay": "$form_data.gameplay",
                            "Story": "$form_data.story",
                            "Graphics": "$form_data.graphics",
                            "Sound": "$form_data.sound",
                            "What did you like about Founders Life?": "$form_data.liked",
                            "What did you dislike about Founder Life?": "$form_data.not_liked",
                            "Founder Life should have more?": "$form_data.more_of",
                            "Founder Life should have less?": "$form_data.less_of",
                            "If I was to only change one thing about the game, it would be?": "$form_data.one_change",
                            "Email": "$form_data.email"
                        }
                    }
                }
            },
            {
                "$project": {
                    "_id": 0, "Feedback Data": 1
                }
            }
        ];
    } else if ( field === "player" ) {
        return [
            {
                "$match": query
            },
            {
                "$unwind": "$sessions_length"
            },
            {
                "$unwind": "$end_data"
            },
            {
                "$group": {
                    "_id": "_id",
                    "Total Play": {
                        "$sum": 1
                    },
                    "Total Unique Users": {
                        "$sum": {
                            "$cond": [ { "$eq": [ "$multiple_ids", false ] }, 1, 0 ]
                        }
                    },
                    "Total Users -- Single Session": {
                        "$sum": {
                            "$cond": [ { "$eq": [ "$sessions", 1 ] }, 1, 0 ]
                        }
                    },
                    "Total Users -- Multi Session": {
                        "$sum": {
                            "$cond": [ { "$gt": [ "$sessions", 1 ] }, 1, 0 ]
                        }
                    },
                    "Total Sessions": {
                        "$sum": "$sessions"
                    },
                    "Average Session per User": {
                        "$avg": "$sessions"
                    },
                    "Average Session Length": {
                        "$avg": {
                            "$divide": [ "$sessions_length", 60 ]
                        } 
                    },
                    "Users who completed FP": {
                        "$sum": {
                            "$cond": [ { "$eq": [ "$ending", "done" ] }, 1, 0 ]
                        }
                    },
                    "Users who did not complete FP": {
                        "$sum": {
                            "$cond": [ { "$ne": [ "$ending", "done" ] }, 1, 0 ]
                        }
                    },
                    "Average XP": {
                        "$avg": "$end_data.total_points"
                    },
                    "Average Days (Users who got bad end)": {
                        "$avg": {
                            "$cond": [ { "$ne": [ "$ending", "done" ] }, "$end_data.days", 0 ]
                        }
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "Total Play": 1,
                    "Total Unique Users": 1,
                    "Total Users -- Single Session": 1,
                    "Total Users -- Multi Session": 1,
                    "Total Sessions": 1, "Average XP": 1,
                    "Average Session per User": 1,
                    "Average Session Length": 1,
                    "Users who completed FP": 1,
                    "Users who did not complete FP": 1,
                    "Average Days (Users who got bad end)": 1
                }
            }
        ];
    } else {
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
                        value: "$play_data." + field
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

module.exports.updateData = function(gameId, updatedObj, endDate, options, callback) {
    var query = { _id: gameId };
    var update = {
        $set: updatedObj,
        $push: { "end_date": endDate, "sessions": updatedObj["sessions"], "sessions_length": updatedObj["sessions_length"] },
        $push: { "end_data": updatedObj }
    };

    GameData.findOneAndUpdate(query, update, options, callback);
};

module.exports.updatePlayData = function(gameId, updatedObj, callback) {
    var query = {
        _id: gameId,
        end_date: {"$exists": false}
    };

    var update = { $push: { "play_data": updatedObj } };
    var options = { $safe: true, upsert: true, new: true };

    GameData.findOneAndUpdate(query, update, options, callback);
};

module.exports.updateMechanicsData = function(gameId, field, data, callback) {
    var query = {
        _id: gameId,
        end_date: {"$exists": false}
    };
    var update = { $push: { ["game_mechanics." + field]: data } };
    var options = { $safe: true, upsert: true, new: true };

    GameData.findOneAndUpdate(query, update, options, callback);
};

module.exports.byId = function(query, callback) {
    GameData.findOne(query, callback);
};

module.exports.aggregateData = function( field, query, callback ) {
    var pipeline = createPipeline( field, query );

    GameData.aggregate( pipeline, callback );
};

module.exports.addFormData = function( gameId, formObj, callback) {
    var query = { _id: gameId, filled_form: false };
    var update = { $set: { "filled_form": true, "form_data": formObj } };
    var options = { upsert: true };

    GameData.findOneAndUpdate(query, update, options, callback);
};
