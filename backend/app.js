const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express(); // created variable to import express functions
const bcrypt = require("bcryptjs"); // using bycryptjs to encrypt passwords
const JWT = require('jsonwebtoken') // using jsonwebtoken library
const JWT_SECRET = "sdygfhf25433"; // secret key used to verify the json webtokens

connectDB(); // Call connectDB import so mongodb is connected

app.use(express.json()); // allows the daat from frontend to be transferred to backend/json file
app.use(cors())
app.use(cors({origin: true, credentials: true}));

// Init middleware
app.use(express.json({extended: false})); // Allows Express to read data sent using a POST or PUT request. It is used for recognizing incoming objects as JSON objects. 

const user = require("./models/Signup"); // import Signup model

// Signup API
app.post("/signup", async(req,res) => {
    const {firstName, lastName, company, email, password}=req.body;
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
            password: encryptedPassword // ensure that password is encrypted when stored into mongo db
        });
        res.send({status: "ok", message: "user registered"});
    } catch (e) {
        console.log(e);
        //res.send({status: "error registering user"});
        res.status(500).send({status: "error", message: e.message});
    }
});

// Login API 
app.post("/login", async(req,res) => {
    const {email, password}=req.body;

    // Check first if user's email exist in db or not 
    const User = await user.findOne({email});
    if (!User) {
        return res.json({status: "error", error: "email_not_found"});
    }
    // Decrypt password and check whether password input matches input in mongo by generating jwt 
    if(await bcrypt.compare(password, User.password)) {
        const token = JWT.sign({}, JWT_SECRET); // will generate a token and pass the jwt_secret variable

        if(res.status(201)) {
            return res.json({status: "ok", data: token });
        }
    }
    res.json({status: "erorr", error: "incorrect_password"});
});

// print server is running when starting server - nodemon app
app.listen(5000, () => {
    console.log("Server is running!");
});