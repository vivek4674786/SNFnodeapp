/*
@uther:         team Smart and Fast Rajkot
Description:    this is the authentication backend
Note:           Login not Required in any the Request

list of Routes:
Route 1: (signup) creating new User withend point [Post]"/home/auth/signup/"
Route 2:  (login) authenticate user [Post]"home/auth/login"

*/

//importing modules
const express = require("express")
const User = require('../models/User');
const router = express.Router()
const { body, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")

var JWT_Sign = "i_am_ethical_user"



// Route 1: (signup) creating new User withend point [Post]/home/auth/signup/  (no login reqiured)
router.post("/createuser", [       // validation of sign-up form

    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("mobileno", "Enter valid mobile number").isLength(10).isNumeric(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),

],
    async (req, res) => {
        let success = false;        //async callback function
        const errors = validationResult(req)
        if (!errors.isEmpty()) {           // send 400 status code if any error found in array
            return res.status(400).json({ errors: errors.array() })
        }

        try {

            // check weather user with this email id exists or not
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.status(400).json({ error: "Sorry User with this Email Already Exists" })
            }

            const salt = await bcrypt.genSalt()  // creating salt using bycrypt.
            const securepwd = await bcrypt.hash(req.body.password, salt) // making hash code of the password using bycrypt.
            user = await User.create({  //storing info to User database.
                email: req.body.email,
                password: securepwd,
                name: req.body.name,
                mobileno: req.body.mobileno
            })

            const data = { // setting user id in data for sending as json web token data.
                User: {
                    id: user.id
                }
            }

            const authtoken = jwt.sign(data, JWT_Sign) // adding secreat sign to token.
            success = true;
            res.json({ success, authtoken }) // sending auth token to user.
        }
        catch (error) {
            console.error(error.message)
            res.status(500).send("Internal Server Error")
        }
    })


//=======================================================================


// Route 2:  (login) authenticate user [Post]home/auth/login (no login required)
router.post("/login", [       // validation of sign-in form
    body("email", "Enter a valid Email").isEmail(),
    body("password", "password can not be empty").exists()
], async (req, res) => {          //async callback function
    let success = false;
    const errors = validationResult(req)
    if (!errors.isEmpty()) {           // send 400 status code if any error found in array
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;
    try {
        // check weather user with this email id exists or not
        let user = await User.findOne({ email })
        if (!user) {
            let success = false;
            return res.status(400).json({success, error: "please login with correct credentials" })
        }

        const pwdCompare = await bcrypt.compare(password, user.password)

        if (!pwdCompare) {
            let success = false;
            return res.status(400).json({success, error: "please login with correct credentials" })
        }

        const data = { // setting user id in data for sending as json web token data.
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_Sign) // adding secreat sign to token.
        success = true;
        res.json({success, authtoken }) // sending auth token to user.
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})


//=======================================================================



module.exports = router;