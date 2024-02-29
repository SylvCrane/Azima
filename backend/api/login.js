// Login API
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // using bycryptjs to encrypt passwords
const JWT = require('jsonwebtoken') // using jsonwebtoken library
const JWT_SECRET = "sdygfhf25433"; // secret key used to verify the json webtokens
const user = require("../models/UserDetails"); // import user details model

router.post("/", async(req,res) => {
    const {email, password} = req.body;

    // Check first if user's email exist in db or not 
    const User = await user.findOne({email});
    if (!User) {
        return res.json({status: "error", error: "email_not_found"});
    }
    // Decrypt password and check whether password input matches input in mongo by generating jwt 
    if(await bcrypt.compare(password, User.password)) {
        const token = JWT.sign({}, JWT_SECRET); // will generate a token and pass the jwt_secret variable

        // 201 - refers to request being fulfiled 
        if(res.status(201)) {
            return res.json({status: "ok", data: token });
        }
    }
    res.json({status: "erorr", error: "incorrect_password"});
});

module.exports = router;