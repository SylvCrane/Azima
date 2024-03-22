const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

connectDB();

//cors
app.use(cors({ origin: true, credentials: true }));

//init middleware
app.use(express.json({ extended: true }));

app.use(express.static(path.join(__dirname, '../frontend/azima/')));

app.get('/', (req, res) => res.send('Tester'));

//routes

const teleporterRouter = require('./routes/api/teleporter');
const markerRouter = require('./routes/api/marker');
const houseRouter = require('./routes/api/house');
const imageRouter = require('./routes/api/image');
const portalRouter = require('./routes/api/portal');

app.use('/api/teleporter', teleporterRouter);
app.use('/api/marker', markerRouter);
app.use('/api/house', houseRouter);
app.use('/api/image', imageRouter);
app.use('/api/portal', portalRouter);

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));