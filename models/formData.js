var mongoose = require("mongoose");
    mongoose.Promise = global.Promise;

var formDataSchema = mongoose.Schema({
    game_id: {
        type: String,
        required: true
    },
    art: {
        type: Number,
        min: 0,
        max: 10
    },
    sound: {
        type: Number,
        min: 0,
        max: 10
    },
    writing: {
        type: Number,
        min: 0,
        max: 10
    },
    gameplay: {
        type: Number,
        min: 0,
        max: 10
    },
    overall: {
        type: Number,
        min: 0,
        max: 10
    },
    favourite_chara: {
        type: String
    },
    least_fun: {
        type: String
    },
    vn_player: {
        type: String
    },
    age_group: {
        type: String
    },
    gender: {
        type: String
    },
    parting_words: {
        type: String
    },
    extra_questions: {
        type: mongoose.Schema.Types.Mixed
    }
});

var FormData = module.exports = mongoose.model("formData", formDataSchema);

// Intialise Game ID
module.exports.addFormData = function(gameId, formDataObj, callback) {
    var obj = {
        game_id: gameId,
        data: formDataObj
    };

    FormData.create(obj, callback);
};
