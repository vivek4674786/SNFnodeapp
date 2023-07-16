/*
@uther:         team Smart and Fast Rajkot
Description:    this is the service Page (home page) backend
Note:           Login not Required in any of the Request

List of Routes:
Route 1: fetching all services [post]"home/servicedomains/allservices"
Route 2: fetching specific services [post]"home/servicedomains/services"

*/

const express = require("express")
const service = require("../models/Serviceinfo")
const router = express.Router()
const fetchuser = require("../middleware/fetchuser")
const { body, validationResult } = require("express-validator")


//===================================================================================

//Route 1: fetching all services [post]"home/servicedomains/allservices" (no login required)
router.get("/allservices", async (req, res) => {
    try {
        const Service = await service.find({})
        res.json(Service)
    }
    catch (error) {
        console.log(error)
    }
})

//===================================================================================

//Route 2: fetching specific services [post]"home/servicedomains/services" (no login required)

router.post("/services/", [          //validationg request
    body("service_type","enter proper service type").exists()
],async (req, res) => {

    const errors = validationResult(req) //returning 400 if find wrong request
    if(!errors.isEmpty){
        return res.status(400).json({ error: errors.array() })
    }
    const { service_type } = req.body
    try {
        //finding all services which has requested service type 
        const Service = await service.find({service_type: service_type})
        res.json(Service)   //sending Services as response
    }
    catch (error) {
        console.log(error)
    }
})


module.exports = router
