const mongoose = require('mongoose');
const portalSchema = require('../models/Portal').schema;
const imageSchema = require('../models/Image').schema;
const Schema = mongoose.Schema;

const houseSchema = new Schema({
    houseID: {
        type: String,
        required: true,
        trim: true
    },
    portals: [portalSchema],
    images: [imageSchema],
    thumbnail: String, 
    rooms: {
        type: Number,
        required: true,
        trim: true
    },
    bathrooms: {
        type: Number,
        required: true,
        trim: true,
    },
    livingAreas: {
        type: Number,
        required: true,
        trim: true,
    },
    sqFootage: {
        type: mongoose.Types.Decimal128,
        required: true,
        trim: true
    },
    price: {
        type: mongoose.Types.Decimal128,
        required: true,
        trim: true
    },
    dateListed: {
        type: Date,
        required: true,
        trim: true
    },
    dateAvailable: {
        type: Date,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    bedrooms: {
        type: Number,
        required: true,
        trim: true
    },
    backyard: {
        type: Boolean,
        required: true,
        trim: true
    },
    laundryRoom: {
        type: Boolean,
        required: true,
        trim: true
    },
    public: {
        type: Boolean,
        default: false,
      
    },
    author: {
        type: String,
        required: true,
        trim: true
    }
  
    
});

module.exports = House = mongoose.model('House', houseSchema);