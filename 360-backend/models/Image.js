const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    image: {
        type: String
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    imageURL: {
        type: String,
        required: true,
        trim: true
    },
   houseID: {
        type: String,
        required: true,
        trim: true
    }
    
    
});

module.exports = Image = mongoose.model('image', imageSchema);