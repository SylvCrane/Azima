// Signup API
const router = require('express').Router();
const bcrypt = require("bcryptjs");
const user = require("../../models/UserDetails");

router.post("/", async(req,res) => {
    const {firstName, lastName, company, email, password} = req.body;
    
    try {
        // First, check if user's email already exists in the database
        const existingUser = await user.findOne({email});
        if (existingUser) {
            return res.send({error: "Email is registered already. Please login instead"});
        }
        
        // Encrypt the password
        const encryptedPassword = await bcrypt.hash(password, 10); 
        
        // Create a new user and store it in the MongoDB database
        const newUser = await user.create({
            firstName,
            lastName, 
            company, 
            email, 
            password: encryptedPassword
        });
        
        // Return the registered email along with the response
        return res.send({status: "ok", message: "User successfully registered.", email: newUser.email });
    } catch (e) {
        console.log(e);
        res.json({status: "error", message: e.message});
    }
});

module.exports = router;