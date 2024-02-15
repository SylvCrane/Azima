const mongoose = require('mongoose');
//const config = require ('config');
//const db = config.get("mongoURI"); // getting mongoURI variable from default.json 
const db = "mongodb+srv://maxinnesjs:AzimaPassword20!@cluster0.5ofofcm.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
      mongoose.set('strictQuery', true);
      await mongoose.connect(db, {
        useNewUrlParser: true,
      });

      console.log('MongoDB is connected!');
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  };

module.exports = connectDB;