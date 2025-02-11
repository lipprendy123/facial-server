const express = require('express');
const { bookingController } = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

const bookingRoute = express.Router();

bookingRoute.get('/bookings', bookingController.getBooking);
bookingRoute.get('/history/booking', authMiddleware, bookingController.getUserBookings);
bookingRoute.post('/bookings', authMiddleware ,bookingController.createBooking);
bookingRoute.put('/bookings/:id', bookingController.updateBooking);
bookingRoute.delete('/bookings/:id', bookingController.deleteBooking );

module.exports = bookingRoute;