/*
@uther:         team Smart and Fast Rajkot
Description:    this is the Profile page crud program
Note:           Login Required in all the Request

List of Routes:
Route 1: get logged-in user details [post] "home/profile/fetchuser"
Route 2: adding new service [post]"home/profile/addservice"
Route 3: Fetching User Services [post]"home/profile/myservices"
Route 4: Updating services [put]"home/profile/updateservice"
Route 5: Deleting services [Delete]"home/profile/deleteservice"

*/

const express = require("express")
const service = require("../models/Serviceinfo")
const user = require("../models/User")
const router = express.Router()
const fetchuser = require("../middleware/fetchuser")
const { body, validationResult } = require("express-validator")
//const axios = require('axios');
const cloudinary = require("cloudinary");


//Route 1: get logged-in user details [post] "home/profile/fetchuser"(login required)
router.post("/fetchuser", fetchuser, async (req, res) => {     //async callback function
    try{
        userId = req.user.id
        const User = await user.findById(userId).select("-password")
        res.send(User)
    }
    catch (error){
        console.log(error)
        console.error(error.message)
        res.status(500).send(error.message)
    }

})

//=====================================================================================

//Route 2: adding new service [post]"home/profile/addservice" (login required)

router.post("/addservice/", fetchuser, [
    body("service_title","enter service title(your shop name)").exists(),
    body("description","write something about your service").exists(),
    body("address","enter your shop address").exists()

], async (req, res) => {
    // de multiplexing attributes form request body
    const { service_title, service_type, image, description, keywords, address } = req.body

    try {
        const cloudImg = await cloudinary.v2.uploader.upload(image, {
            folder: "serviceImg",
        });
        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() })
        }
        let User = await user.findById(req.user.id) //fetching user by id to store its mobile no and email to service.
        //setting up services
        const Service = new service({
            service_title, service_type, image:{
                publicId: cloudImg.public_id,
                url: cloudImg.url,
            }, description, keywords, address, user: req.user.id, email: User.email, mobileno: User.mobileno
        })
        const savedService = await Service.save() //saving services

        res.status(200).json(savedService) //returing service data
    }
    catch (error) {
        console.log(error)
        res.status(500).send("error occured while saving note")
    }
})

//=====================================================================================

//Route 3: Fetching User Services [post]"home/profile/myservices" (login Required)
router.post("/myservices/", fetchuser, async (req,res) => {
    try{
        userId = req.user.id
        const Services = await service.find({user: userId})
        res.send(Services)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send("error occured while fetching mynotes")
    }
})

//=====================================================================================

//Route 4: Updating services [put]"home/profile/updateservice" (login required)
router.put("/updateservice/:id", fetchuser, async (req, res) => {

    //destructuring request body
    const { service_title, service_type, image, description, keywords, address } = req.body
    try {
        //creating new object and add data from service
        const newService = {}
        if(service_title){newService.service_title = service_title}
        if(service_type){newService.service_type = service_type}
        if(image){newService.image = image}
        if(description){newService.description = description}
        if(keywords){newService.keywords = keywords}
        if(address){newService.address = address}
        
        //find the service
        let Service = await service.findById(req.params.id)
        
        if(!Service){         //if service id does not exist
            return res.status(404).send("not found")
        }

        if(Service.user.toString() !== req.user.id){  //if user is not the authorized of Service
            return res.status(401).send("Access Denied")
        }

        //if above both conditions true, find the service and update it
        Service = await service.findByIdAndUpdate(req.params.id, {$set: newService}, {new:true})
        res.json({Service})

    }
    catch (error) {
        console.log(error)
    }
})

//=====================================================================================

//Route 5: Deleting services [Delete]"home/profile/deleteservice" (login required)
router.delete("/deleteservice/:id", fetchuser, async (req, res) => {
    try {
        //find the service
        let Service = await service.findById(req.params.id)
        
        if(!Service){         //if service id does not exist
            return res.status(404).send("Service dosen't exist.")
        }

        if(Service.user.toString() !== req.user.id){  //if user is not the authorized of Service
            return res.status(401).send("Access Denied")
        }

        //if above both conditions true, find the service and delete it
        Service = await service.findByIdAndDelete(req.params.id)
        res.status(200).json(Service)
        

    }
    catch (error) {
        console.log(error)
    }
})


module.exports = router
