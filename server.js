const express = require('express');
const cors = require('cors');
const connectDb = require('./config/db');
require('dotenv').config();
const cookieParser = require("cookie-parser");
const serviceRoute = require('./routes/serviceRoute');
const authRoute = require('./routes/authRoute');
const benefitRoute = require('./routes/benefitRoute');
const bookingRoute = require('./routes/bookingRoute');
const port = 4000;

const app = express();

app.use(cors());
app.use(cookieParser());
app.use('/public', express.static('public'));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDb();

app.use('/api', serviceRoute);
app.use('/api/auth', authRoute);
app.use('/api', benefitRoute);
app.use('/api', bookingRoute)

app.listen(port, () => {
    console.log(`Server run on port ${port}`);
})
    

