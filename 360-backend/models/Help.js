/* Schema/model for help page that defines the structure 
    and required properties of the data and their types.
*/

const mongoose = require('mongoose');

const HelpDetailsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Must provide a name"]
    },
    email: {
        type: String, 
        required: [true, "Must provide a email"]
    },
    subject: {
        type: String, 
        required: [true, "Must provide a subject"]
    },
    message: {
        type: String,
        required: [true, "Must provide a message"]
    }
});

const HelpDetails = mongoose.model("HelpDetails", HelpDetailsSchema);
module.exports = HelpDetails;