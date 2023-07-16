/*
@uther:         team Smart and Fast Rajkot
Description:    this is user model/schema for mongo
*/

const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    mobileno:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profile_pic:{
        type: String,
    }
})
const User = mongoose.model("user",UserSchema);
module.exports = User;