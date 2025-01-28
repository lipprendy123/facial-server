const express = require('express');
const cors = require('cors');
const connectDb = require('./config/db');
require('dotenv').config();
const serviceRoute = require('./routes/serviceRoute');
const port = 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDb();

app.use('/api', serviceRoute);

app.listen(port, () => {
    console.log(`Server run on port ${port}`);
})


