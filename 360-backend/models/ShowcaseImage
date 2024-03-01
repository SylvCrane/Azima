const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const showcaseImageSchema = new Schema({
    houseID: {
        type: String,
        required: true,
        trim: true
    },
    priorityImage: {
        type: Boolean,
        required: true,
        trim: true
    },
    imageName: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = showcaseImage = mongoose.model('showcaseImage', showcaseImageSchema);