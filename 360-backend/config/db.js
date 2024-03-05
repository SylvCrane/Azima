const mongoose = require('mongoose');
const config = require('config');
const db = "mongodb+srv://navjotnsandhu:ODJaFmLXKCD72Ak1@picturepractice.fjysf5h.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
    try
    {
        mongoose.set('strictQuery', true);
        await mongoose.connect(db, {useNewUrlParser: true, });

        console.log('MongoDB is Connected...');
    }
    catch (err)
    {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;