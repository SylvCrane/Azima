const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");

// Retrieving environment variables
const azimaEmail = process.env.EMAIL;
const password = process.env.PASSWORD;

// Create a transport using nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Assuming you're using Gmail; adjust as necessary
    auth: {
        user: azimaEmail,
        pass: password
    }
});

router.post('/', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: `${email}`,          // The Azima team's email address
        to: azimaEmail,            // The recipient email is also the Azima team's email
        subject: `Help Request from ${name}`, // Customize the subject line
        text: `From: ${name}\nEmail: ${email}\nMessage: ${message}`, // Include the user's name and email in the message body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ status: 'error', message: 'Error sending email: ' + error.message });
        }
        res.status(200).json({ status: 'ok', message: 'Email sent: ' + info.response });
    });
});

module.exports = router; // Make sure to export the router