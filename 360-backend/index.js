const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');


connectDB();

//cors
app.use(cors({ origin: true, credentials: true }));

//init middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Hello world!'));


//routes
const userRouter = require('./routes/api/user');
app.use('/api/user', userRouter);

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));