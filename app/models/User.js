var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    lastName: String,
    email: String,
    password: String,
    description: String,
    gender: String,
    birthDate: Date,
    picture: String,
    emailValidation: Boolean
});

mongoose.model('User', UserSchema);