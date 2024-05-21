const router = require('express').Router();
const dot = require("dotenv");
dot.config().parsed;
const JWT = require('jsonwebtoken') // using jsonwebtoken library
const JWT_SECRET = process.env.JWT_SECRET; // secret key used to verify the json webtokens
const user = require("../../models/UserDetails"); // import user details model
// router.set("view engine", "ejs"); // Using ejs to create 


router.post("/", async(req,res) => {
    const { email } = req.body;
    
    try {
        // First, check if user's email does not exist in the database
        const existingUser = await user.findOne({email});
        if (!existingUser) {
            return res.json({status: "error", error: "user_registered"});
        }

        // If user email does exist get secret code and attain the users password
        const secret = JWT_SECRET + existingUser.password;
        // create a token that passes the email and creates an expiration time for the email link.
        const token = JWT.sign({email: existingUser.email, id: existingUser._id}, secret, { 
            expiresIn: "5m", 
        });
        // Link that will be sent to the users email, where they can set their password.
        const link = `http://localhost:8082/reset-password/${existingUser._id}/${token}`;
        console.log(link);

        // Return response once email is found and is sent the token and link
        return res.json({
            status: "ok",
            email: existingUser.email,
            link: link
        })
        
    } catch (e) {
        console.log(e);
        res.json({status: "error", message: e.message});
    }
});


router.get("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    console.log(req.params);
    const existingUser = await user.findOne({_id:id});

    if (!existingUser) {
        return res.json({status: "error", error: "user_registered"});
    }

    const secret = JWT_SECRET + existingUser.password;

    try {
        const verify = JWT.verify(token, secret);
        res.send("Verified");
    }
    catch (e) {
        res.send("Not verified");
    }

});

module.exports = router;