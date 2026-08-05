const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

console.log(passportLocalMongoose);
console.log(typeof passportLocalMongoose);

const userSchema = new Schema({
    email:String,
    username:String,
    password:String
});

userSchema.plugin(passportLocalMongoose);
module.exports =  mongoose.model("Users", userSchema);