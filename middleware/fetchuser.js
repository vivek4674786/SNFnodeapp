/*
@uther:         team Smart and Fast Rajkot
Description:    fetch user middleware

*/

var jwt = require("jsonwebtoken")

var JWT_Sign = "i_am_ethical_user"

const fetchUser = (req, res, next) => {
    //get the user from jwt token
    const token = req.header("auth-token")
    if (!token) {
        res.status(401).send({ error: "not got any auth-token" })
    }

    try {
        const data = jwt.verify(token, JWT_Sign)
        req.user = data.user
        next()
    }
    catch (error) {
        console.log("error in fetch-user catch: ")
        console.log(error)
        res.status(401).send({ error: "authenticate using valid token" })
    }
}

module.exports = fetchUser
