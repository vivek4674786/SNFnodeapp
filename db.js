/*
@uther:         team Smart and Fast Rajkot
Description:    Database connection.

*/

require("dotenv").config();
const mongoose = require("mongoose")

const mongoURI = process.env.MONGO_URI;
//"mongodb+srv://smartandfastrajkot:weare3members@smart-and-fast-rajkot.w6dvfzg.mongodb.net/?retryWrites=true&w=majority"
//const mongoURI = "mongodb://localhost:27017/s&fRajkot"

const connectToMongo = () => {
    mongoose.connect(mongoURI)
    console.log("conected to database")
}

module.exports = connectToMongo