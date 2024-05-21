// Login API
const express = require("express");
const router = express.Router();
const dot = require("dotenv");
dot.config().parsed;
const bcrypt = require("bcryptjs");
const JWT = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../../models/UserDetails");

router.post("/", async(req,res) => {
    const {email, password} = req.body;

    try {
        const existingUser = await User.findOne({email});
        if (!existingUser) {
            return res.json({status: "error", error: "email_not_found"});
        }

        if(await bcrypt.compare(password, existingUser.password)) {
            const token = JWT.sign({}, JWT_SECRET);

            // Return complete user profile
            return res.json({
                status: "ok",
                user: {
                    email: existingUser.email,
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    bio: existingUser.bio,
                    company: existingUser.company,
                    location: existingUser.location,
                    profileImage: existingUser.profileImage
                },
                token,
            });
        }
        res.json({status: "error", error: "incorrect_password"});
    }
    catch (e) {
        console.log(e);
        res.json({status: "error", message: e.message});
    }
});

module.exports = router;