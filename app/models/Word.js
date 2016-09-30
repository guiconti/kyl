var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var WordSchema = new Schema({
    word: String,
    difficulty: Number,
    type: String,
});

mongoose.model('Word', WordSchema);