const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teleporterSchema = new Schema({
    houseID: {
        type: String,
        required: true,
        trim: true
    },
    teleporterDetails: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = Teleporter = mongoose.model('Teleporter', teleporterSchema);