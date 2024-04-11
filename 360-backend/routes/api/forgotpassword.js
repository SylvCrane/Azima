const express = require("express");
const router = express.Router();
const dot = require("dotenv");
dot.config().parsed;
const JWT = require('jsonwebtoken') // using jsonwebtoken library
const JWT_SECRET = process.env.JWT_SECRET; // secret key used to verify the json webtokens
const user = require("../../models/UserDetails"); // import user details model


router.post("/", async(req,res) => {
    const { email } = req.body;
    
    try {
        // First, check if user's email does not exist in the database
        const existingUser = await user.findOne({email});
        if (!existingUser) {
            return res.send({error: "Email is not registered"});
        }

        // get secret code and attain the users password
        const secret = JWT_SECRET + existingUser.password;
        // create a token that passes the email and creates an expiration time for the email link.
        const token = JWT.sign({email: existingUser.email, id: existingUser._id},secret, { 
            expiresIn: "5m", 
        });
        // Link that will be sent to the users email.
        const link = `http://localhost:8082/reset-password/${existingUser._id}/${token}`;
        console.log(link);
        
    } catch (e) {
        console.log(e);
        res.json({status: "error", message: e.message});
    }
});

module.exports = router;