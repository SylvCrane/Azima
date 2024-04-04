const mongoose = require('mongoose');

//Creates a mongoose schema
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    photo: {
        type: String
    },
    birthdate: {
        type: String
    }
});

module.exports = User = mongoose.model('User', userSchema);