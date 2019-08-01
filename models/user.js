var mongoose = require("mongoose");
var passpoerlocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String 
});

UserSchema.plugin(passpoerlocalMongoose);
module.exports = mongoose.model("User", UserSchema);