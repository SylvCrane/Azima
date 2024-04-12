const express = require('express');
const app = express();
const dot = require("dotenv");
dot.config().parsed;
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
// Routes
const teleporterRouter = require('./routes/api/teleporter');
const markerRouter = require('./routes/api/marker');
const houseRouter = require('./routes/api/house');
const imageRouter = require('./routes/api/image');
const portalRouter = require('./routes/api/portal');
const signupRouter = require("./routes/api/signup"); 
const loginRouter = require("./routes/api/login"); 


connectDB(); // Call connectDB import so mongoDB is connected
console.log("DB connected")

app.use(express.json()); // allows the data from frontend to be transferred to backend/json file
app.use(cors());
app.use(cors({origin: true, credentials: true}));

// Init middleware
app.use(express.json({extended: false})); // Allows Express to read data sent using a POST or PUT request. It is used for recognizing incoming objects as JSON objects. 


// middleware/routes
app.use('/api/login', loginRouter);
app.use('/api/signup', signupRouter);
app.use('/api/teleporter', teleporterRouter);
app.use('/api/marker', markerRouter);
app.use('/api/house', houseRouter);
app.use('/api/image', imageRouter);
app.use('/api/portal', portalRouter);


// print server is running when starting server - nodemon app
const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));
