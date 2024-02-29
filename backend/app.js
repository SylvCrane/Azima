const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express(); // created variable to import express functions
const signupRouter = require("./api/signup"); // Import signup api
const loginRouter = require("./api/login"); // import login api

connectDB(); // Call connectDB import so mongodb is connected

app.use(express.json()); // allows the daat from frontend to be transferred to backend/json file
app.use(cors());
app.use(cors({origin: true, credentials: true}));

// Init middleware
app.use(express.json({extended: false})); // Allows Express to read data sent using a POST or PUT request. It is used for recognizing incoming objects as JSON objects. 

// Pass signup and login apis into app variable. 
app.use("/signup", signupRouter);
app.use("/login", loginRouter);

// print server is running when starting server - nodemon app
app.listen(5000, () => {
    console.log("Server is running!");
});