/*
@uther:         team Smart and Fast Rajkot
Description:    Index program

*/
require("dotenv").config();
const connectToMongo = require("./db")
const express = require("express")
var cors = require('cors') 
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "dwhipvwrs",
    api_key: "944889473782839",
    api_secret: "821VupqxOSb6aT5g-oFfC8BS27I",
});
connectToMongo()


//creating application
const app = express();
app.use(express.json({limit: "10mb"}));
const port = process.env.PORT;

app.use(cors())
app.use(express.json())

//Available Routed
app.use("/home/auth", require("./routes/auth"))
app.use("/home/servicedomains", require("./routes/service"))
app.use("/home/profile",require("./routes/profile"))


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})