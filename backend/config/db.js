const dot = require("dotenv");
dot.config().parsed; // ENSURE THIS IS ADDED BEFORE MONGOOSE IMPORT OR MONGODB WILL NOT CONNECT.
const mongoose = require("mongoose");
const mongodb = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
      mongoose.set('strictQuery', true);
      await mongoose.connect( mongodb, {
        useNewUrlParser: true,
      });

      console.log('MongoDB is connected!');
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  };

module.exports = connectDB;