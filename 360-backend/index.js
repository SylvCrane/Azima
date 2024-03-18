const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');
<<<<<<< HEAD

=======
const path = require('path');
>>>>>>> Brandyn2

connectDB();

//cors
app.use(cors({ origin: true, credentials: true }));

//init middleware
<<<<<<< HEAD
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Hello world!'));

//routes
=======
app.use(express.json({ extended: true }));

app.use(express.static(path.join(__dirname, '../frontend/azima/')));


//routes

>>>>>>> Brandyn2
const teleporterRouter = require('./routes/api/teleporter');
const markerRouter = require('./routes/api/marker');
const houseRouter = require('./routes/api/house');
const imageRouter = require('./routes/api/image');
<<<<<<< HEAD
=======
const portalRouter = require('./routes/api/portal');
>>>>>>> Brandyn2

app.use('/api/teleporter', teleporterRouter);
app.use('/api/marker', markerRouter);
app.use('/api/house', houseRouter);
app.use('/api/image', imageRouter);
<<<<<<< HEAD
=======
app.use('/api/portal', portalRouter);
>>>>>>> Brandyn2

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));