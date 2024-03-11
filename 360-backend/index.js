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
const teleporterRouter = require('./routes/api/teleporter');
const markerRouter = require('./routes/api/marker');
const houseRouter = require('./routes/api/house');
const imageRouter = require('./routes/api/image');

app.use('/api/teleporter', teleporterRouter);
app.use('/api/marker', markerRouter);
app.use('/api/house', houseRouter);
app.use('/api/image', imageRouter);

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));