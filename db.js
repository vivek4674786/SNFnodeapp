/*
@uther:         team Smart and Fast Rajkot
Description:    Database connection.

*/

require("dotenv").config();
const mongoose = require("mongoose")

const mongoURI = process.env.MONGO_URI;

const connectToMongo = () => {
    mongoose.connect(mongoURI)
    console.log("conected to database")
}

module.exports = connectToMongo
