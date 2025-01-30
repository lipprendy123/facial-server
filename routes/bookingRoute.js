const express = require('express');
const { bookingController } = require('../controllers/bookingController');

const bookingRoute = express.Router();

bookingRoute.get('/bookings', bookingController.getBooking);
bookingRoute.post('/bookings', bookingController.createBooking);
bookingRoute.put('/bookings/:id', );
bookingRoute.delete('/bookings/:id', );

module.exports = bookingRoute;