const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");

// Retrieving environment variables
const azimaEmail = process.env.EMAIL;
const password = process.env.PASSWORD;

const sendEmail = async (subject, message, send_to, sent_from, reply_to, senderName) => {
  const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
          user: azimaEmail,
          pass: password,
      },
      tls: {
          rejectUnauthorized: false,
      },
  });

  const options = {
      from: sent_from,  // Use your verified sender address here
      to: send_to,
      replyTo: reply_to,
      subject: subject,
      text: message,  // Include sender details in the body
  };

  try {
      const info = await transporter.sendMail(options);
      console.log("Email sent:", info);
      return info;
  } catch (err) {
      console.error("Error sending email:", err);
      throw err;  // Re-throw the error to be caught by the calling function
  }
};

module.exports = sendEmail;