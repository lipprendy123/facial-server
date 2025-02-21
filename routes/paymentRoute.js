const express = require('express');
const { createPayment } = require('../controllers/paymentController');
const paymentRoute = express.Router();

paymentRoute.post('/create-transaction', createPayment);

module.exports = paymentRoute;
