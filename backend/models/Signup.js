// model for user signup info

const mongoose = require('mongoose');

const SignupSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String, 
        required: true
    },
    company: {
        type: String 
    },
    email: {
        // ensure that the email is unique so that an existing user does not signup w/ the same email
        type: String, unique: true, 
        required: true
    },
    password: {
        type: String, 
        required: true
    }
});

const Signup = mongoose.model('Signup', SignupSchema);
module.exports = Signup;