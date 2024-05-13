const express = require("express");
const router = express.Router();
const sendEmail = require("../../utils/sendEmail");
const HelpDetails = require("../../models/Help");
const azimaEmail = process.env.EMAIL;

router.post("/", async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        // Create and save a new help message entry directly
        const newHelpDetails = await HelpDetails.create({
            name,
            email,
            subject,
            message
        });

        // Prepare detailed message with sender's info
        const senderDetails = `\n\nMessage from [${name}] <${email}>:\n\n${message}`;

        // Proceed to send an email
        const send_to = azimaEmail; 
        const sent_from = email;
        const reply_to = email; // Set reply-to address to the user's email to direct responses

        // Send email with detailed sender info in the message body
        const emailInfo = await sendEmail(subject, senderDetails, send_to, sent_from, reply_to);
        console.log("Email Info:", emailInfo);  

        res.json({
            status: "ok",
            message: "Email sent successfully!"
        });
    } catch (error) {
        console.error("Failed to save help details or send email:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to process your request due to an internal server error."
        });
    }
});

module.exports = router;