/*
@uther:         team Smart and Fast Rajkot
Description:    this is Service model/schema for mongo
*/

const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./User")

const serviceSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    service_title:{   //shop name
        type: String,
        required: true,
        // unique: true
    },
    service_type:{    // service type (mech, ele, automobile, home cleaning)
        type: String,
        required: true
    },
    image:{
        publicId: String,
        url: String,
    },
    mobileno:{
        type: String
    },
    email:{
        type: String
    },
    description:{
        type: String,
    },
    keywords:{
        type: String,
    },
    address:{
        type: String,
    }
})

module.exports = mongoose.model("service",serviceSchema)