var mongoose = require("mongoose");

var playDataSchema = mongoose.Schema({
    game_id: {
        type: String,
        required: true
    },
    data: {
        type: Schema.Types.Mixed
    }
});

var PlayData = module.exports = mongoose.model("playData", playDataSchema);
