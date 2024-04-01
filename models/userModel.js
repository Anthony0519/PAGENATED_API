const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phoneNumber:{
        type:String,
        required:true,
    },
    profilePics :{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    blackList:{
        type:Array,
        default:[]
    },
},{timestamps:true})

const userModel = mongoose.model("user",userSchema)

module.exports = userModel