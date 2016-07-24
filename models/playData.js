var mongoose = require("mongoose");
    mongoose.Promise = global.Promise;

var playDataSchema = mongoose.Schema({
    game_id: {
        type: String,
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed
    }
});

var PlayData = module.exports = mongoose.model("playData", playDataSchema);

// Intialise Game ID
module.exports.addPlayData = function(gameId, playDataObj, callback) {
    var obj = {
        game_id: gameId,
        data: playDataObj
    };

    PlayData.create(obj, callback);
};
