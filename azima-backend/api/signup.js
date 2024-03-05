// Signup API
const express = require("express");
const app = express.Router(); // created variable to import express router function for the signup api
const bcrypt = require("bcryptjs");
const user = require("../models/UserDetails"); // import user details model

app.post("/", async(req,res) => {
    const {firstName, lastName, company, email, password} = req.body;
    // Created a variable that will ensure user's password is encrypted in mongodb. 
    const encryptedPassword = await bcrypt.hash(password, 10); 
    try {
        // First check if users email exist in the database
        const existingUser = await user.findOne({email});
        if (existingUser) {
            return res.send({error: "Email is registered already. Please login instead"});
            
        }
        // Otherwise will create new user and store into mongo database.
        await user.create({
            firstName,
            lastName, 
            company, 
            email, 
            password: encryptedPassword // ensure that password is encrypted when stored into mongodb
        });
        res.send({status: "ok", message: "user registered"});
    } catch (e) {
        console.log(e);
        res.status(500).send({status: "error", message: e.message});
    }
});

module.exports = app;