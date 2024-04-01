const mongoose = require("mongoose")

const roomSchema = new mongoose.Schema({
    hotel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"hotels",
    },
    roomImage:{
        type:String,
    },
    roomType:{
        type:String,
        required:true,
    },
    roomNum:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true
    },
    // isBooked:{
    //     type:Boolean,
    //     default:false
    //   },

},{timestamps:true})

const roomModel = mongoose.model("rooms",roomSchema)

module.exports = roomModel