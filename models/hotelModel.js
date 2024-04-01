const mongoose = require("mongoose")

const hotelSchema = new mongoose.Schema({
    hotelName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type:Number,
        required:true,
    },
    profileImage:{
        type:String,
    },
    hotelImages:[{
        type:String,
    }],
    hotelRooms:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"rooms"
    }],
    city:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    desc:{
        type:String,
    },
    stars:{
        type:Number,
    },
    features:{
        type:Array,
    },
    password:{
        type:String,
        required:true,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    hotelBlacklist:{
        type:Array,
        default:[]
    },
},{timestamps:true})

const hotelModel = mongoose.model("hotels",hotelSchema)

module.exports = hotelModel