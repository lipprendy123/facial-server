const express = require('express');
const Payment = require('../models/payment_model');

const paymentController = {
    async createPayment(req, res) {
        try {

            if (!req.files || req.files.length === 0 ) {
                return res.status(400).json({
                    success: false,
                    message: 'File image is required'
                })   
            }

            const filePaths = req.files.map(file => file.filename)

            const {amount, bank, proofImage} = req.body;
            
            const data = {
                amount,
                bank,
                proofImage: filePaths
            }

            const payment = await Payment.create(data)

            return res.status(201).json({
                success: true,
                message: 'Payment created',
                data: payment
            })

        } catch (error) {
            console.error('Error', error.message)
            return res.status(404).json({
                success: false,
                message: 'Failed create payment',
                error: error.message
            })
        }
    }
}

module.exports = {
    paymentController
}