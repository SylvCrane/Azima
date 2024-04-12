const mongoose = require('mongoose');

const portalSchema = new mongoose.Schema({
  destination: { type: String, required: true }, 
  location: { type: String, required: true }, 
  houseID: {
    type: String,
    required: true,
    trim: true
},
  triangles: [{
    vertexA: { type: String, required: true },
    vertexB: { type: String, required: true },
    vertexC: { type: String, required: true },
    color: { type: String, required: true } 
  }],
  textData: [{
    value: { type: String, required: true },
    position: { type: String, required: true }, 
    rotation: { 
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      z: { type: Number, required: true }
    },
 
  }]
  
});

const Portal = mongoose.model('Portal', portalSchema);

module.exports = Portal;