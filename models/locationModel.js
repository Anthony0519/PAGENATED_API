const mongoose = require("mongoose")

const hotelLocation = new mongoose.Schema({
    loc:{
        type:String,
        required:true
    },
    hotel:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"hotels",
    }],
},{timestamps:true})

const locModel = mongoose.model("Location",hotelLocation)

module.exports = locModel