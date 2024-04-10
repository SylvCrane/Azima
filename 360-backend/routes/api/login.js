// Login API
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // using bycryptjs to encrypt passwords
const JWT = require('jsonwebtoken') // using jsonwebtoken library
const JWT_SECRET = "sdygfhf25433"; // secret key used to verify the json webtokens
const user = require("../../models/UserDetails"); // import user details model

router.post("/", async(req,res) => {
    const {email, password} = req.body;

    try {
        // Check first if user's email exist in db or not 
        const existingUser = await user.findOne({email});
        if (!existingUser) {
            return res.json({status: "error", error: "email_not_found"});
        }
        // Decrypt password and check whether password input matches input in mongo by generating jwt 
        if(await bcrypt.compare(password, existingUser.password)) {
            const token = JWT.sign({}, JWT_SECRET); // will generate a token and pass the jwt_secret variable

            /*// 201 - refers to request being fulfiled 
            if(res.status(201)) {
                return res.json({status: "ok", data: token });
            }*/

            // Return user's email along with token
            return res.json({status: "ok", user: { email }, token });
        }
        res.json({status: "error", error: "incorrect_password"});
    }
    catch (e) {
        console.log(e);
        res.json({status: "error", message: e.message});
    }
});

module.exports = router;