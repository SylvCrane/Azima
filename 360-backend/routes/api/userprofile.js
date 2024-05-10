const express = require('express');
const router = express.Router();
const User = require("../../models/UserDetails");
const multer = require("multer");
const path = require('path');

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads'); // Will save profile images uploaded in these folders.
    },
    filename: function(req, file, cb) {
        const imageName = file.originalname;
        cb(null, imageName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (allowedFileTypes.includes(file.mimetype))
    {
        cb (null, true);
    }
    else
    {
        cb(null, false);
    }
}
const upload = multer({ storage, fileFilter });

// Update Profile
router.put('/', upload.single('profileImage'), async (req, res) => {
    const { firstName, lastName, email, bio, company, location } = req.body;

    try {
        // Find the user by their current session or identifier
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // // Check if the email is changed to another existing email
        // if (email === user.email) {
        //     const existingUser = await User.findOne({ email: email });
        //     if (existingUser === user.email) {
        //         return res.json({ status: "error", error: "existing_email" });
        //     }
        // }

        // Check if the email is changed to another existing email
        if (email !== user.email) {
            return res.json({ status: "message", message: "successful email change" });
        }
        else {
            return res.json({ status: "error", error: "existing_email" });
        }

        // Update user details; only update if provided
        user.email = email ||  user.email;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.bio = bio !== undefined ? bio : user.bio;
        user.company = company !== undefined ? company : user.company;
        user.location = location !== undefined ? location : user.location;

        // Update the profile image if a new one was uploaded
        if (req.file) {
            user.profileImage = `http://localhost:8082/uploads/${req.file.filename}`;
        }

        await user.save();

        // Return updated user details
        return res.json({
            status: "ok",
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                bio: user.bio,
                company: user.company,
                location: user.location,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;