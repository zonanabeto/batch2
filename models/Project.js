const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    status:{
        type:String,
        enum:["PENDING","ACTIVE"],
        default:"PENDING"
    },
    name: String,
    desc: String,
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    } 
    }, {
        timestamps:{
            createdAt:"created_at",
            updatedAt:"updates_at"
        }

});

module.exports = mongoose.model("Project", projectSchema);