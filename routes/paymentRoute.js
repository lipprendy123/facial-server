const express = require('express');
const paymentRoute = express.Router();
const { createTransaction } = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

paymentRoute.post('/create-transaction', authMiddleware, createTransaction);

module.exports = paymentRoute;