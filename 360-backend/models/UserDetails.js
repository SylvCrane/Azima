/* Schema/model for user login info that defines the structure 
    and required properties of the data and their types.
*/

const mongoose = require('mongoose');

const UserDetailsSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Must provide a first name"]
    },
    lastName: {
        type: String, 
        required: [true, "Must provide a last name"],
    },
    company: {
        type: String 
    },
    email: {
        // ensure that the email is unique so that an existing user does not signup w/ the same email
        type: String, unique: true, 
        required: [true, "Must provide an email."],
        unique: [true, "Must be unique."]
    },
    password: {
        type: String, 
        required: [true, "Must provide a password"]
    }
});

const UserDetails = mongoose.model("UserDetails", UserDetailsSchema);
module.exports = UserDetails;