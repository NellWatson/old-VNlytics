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
    final_game_pass: {
        type: Number
    },
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
    money_in_hand: {
        type: Number
    },
    completion_days: {
        type: Number
    },
    founder_name: {
        type: String
    },
    founder_startup: {
        type:String,
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
        narrative: {
            type: String
        },
        dialogue: {
            type: String
        },
        character: {
            type: String
        },
        liked: {
            type: String
        },
        not_liked: {
            type: String
        },
        improvement: {
            type: String
        },
        confusing_parts: {
            type: String
        },
        player_changes: {
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
    freelance: {
        game_pass: {
            type: Number
        },
        name: {
            type: String
        },
        status: {
            type: String
        },
        date: {
            type: String
        }
    },
    startup: {
        game_pass: {
            type: Number
        },
        name: {
            type: String
        },
        status: {
            type: String
        },
        date: {
            type: String
        }
    },
    choices: {
        game_pass: {
            type: Number
        },
        label: {
            type: String
        },
        status: {
            type: String
        },
        date: {
            type: String
        }
    },
    game_mechanics: {
        mail_system: [],
        job_system: [],
        travel_system: [],
        to_do_system: [],
        general: []
    }
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
    } else if ( field === "stats" ) {
        return [
            {
                "$match": query
            },
            {
                "$group": {
                    "_id": "completion_days",
                    "count_days": {
                        "$avg": "$completion_days"
                    },
                    "count_money": {
                        "$avg": "$money_in_hand"
                    }
                }
            },
            {
                "$project": {
                    "_id": 0, "count_money": 1, "count_days": 1
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
                            "What do you think about the overall story?": "$form_data.narrative",
                            "How did you find the in-game dialogues?": "$form_data.dialogue",
                            "What are your views on the character? Did you find them believable?": "$form_data.character",
                            "What did you like about Founder Life?": "$form_data.liked",
                            "What did you dislike about Founder Life?": "$form_data.not_liked",
                            "If you could change one thing in the game, what would it be?": "$form_data.improvement",
                            "Was there any point where you were confused by what was happening?": "$form_data.confusing_parts",
                            "What, if anything, would have to change before you played Founder Life again?": "$form_data.player_changes",
                            "Email": "$form_data.email",
                            "Mail": "$game_mechanics.mail_system",
                            "Job": "$game_mechanics.job_system",
                            "Travel": "$game_mechanics.travel_system",
                            "To Do": "$game_mechanics.to_do_system",
                            "General": "$game_mechanics.general"
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
                "$unwind": {
                    "path": "$sessions_length"
                }
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
                    "Average Session Length": {
                        "$avg": "$sessions_length"
                    },
                    "Users who completed FP": {
                        "$sum": {
                            "$cond": [ { "$eq": [ "$ending", "None" ] }, 1, 0 ]
                        }
                    },
                    "Users who did not complete FP": {
                        "$sum": {
                            "$cond": [ { "$ne": [ "$ending", "None" ] }, 1, 0 ]
                        }
                    }
                }
            },
            {
                "$project": {
                    "_id": 0, "Total Play": 1, "Total Unique Users": 1, "Total Users -- Single Session": 1, "Total Users -- Multi Session": 1, "Total Sessions": 1, "Average Session Length": 1, "Users who completed FP": 1, "Users who did not complete FP": 1
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

module.exports.updateData = function(gameId, updatedObj, options, callback) {
    var query = { _id: gameId };
    var update = {
        $set: updatedObj,
        $push: { "sessions_length": updatedObj["final session"] },
        $inc: { "sessions": 1 }
    };

    GameData.findOneAndUpdate(query, update, options, callback);
};

module.exports.updatePlayData = function(gameId, updatedObj, callback) {
    var query = {
        _id: gameId,
        end_date: {"$exists": false}
    };

    if ( updatedObj["type"] === "freelance" ) {
        var update = { $addToSet: { "freelance": updatedObj["data"] } };
    } else if ( updatedObj["type"] === "startup" ) {
        var update = { $addToSet: { "startup": updatedObj["data"] } };
    } else if ( updatedObj["type"] === "choices" ) {
        var update = { $addToSet: { "choices": updatedObj["data"] } };
    } else if ("sessions_length" in updatedObj) {
        var update = {
            $push: updatedObj,
            $inc: { "sessions": 1 }
        };
    } else {
        var update = { $push: { "play_data": updatedObj } };
    };
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
