const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const helpSchema = new Schema({

    area: String,
    description: String,
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

module.exports = mongoose.model("Help", helpSchema);