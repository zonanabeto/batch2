const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PassportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    name:String,
    lastName:String,
    googleID:String,
    linkedinID:String,
    facebookID:String,
    profilePic:String,
    email: {
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["ADMIN","USER","FRONTEND","BACKEND","DESIGN","SERVER"],
        default:"USER"
    },
    projects:[{
        type:Schema.Types.ObjectId,
        ref:"Project"
    }]

}, {
    timestamps:{
        createdAt:"created_at",
        updatedAt:"updates_at"
    }
});


userSchema.plugin(PassportLocalMongoose, {usernameField:"email"});
module.exports = mongoose.model("User", userSchema);
