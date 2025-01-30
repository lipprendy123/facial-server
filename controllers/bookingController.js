const express = require('express');
const Booking = require('../models/booking_model');
const Service = require('../models/service_model');

const bookingController = {
    async getBooking(req, res) {
        try {
            const booking = await Booking.find().populate({path: 'service'})

            return res.status(200).json({
                success: true,
                message: 'Get data booking success',
                data: booking
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },

    async createBooking(req, res) {
        try {
            const {clientName, clientEmail, clientPhone, service, date, type, time, bookingType} = req.body;

            const allowedBookingTypes = ['home_calling', 'visit_to_clinic'];

            if (!allowedBookingTypes.includes(bookingType)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid booking type'
                })
            }

            const serviceExists = await Service.findById(service);

            if (!serviceExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Service not found'
                })
            }

            const newBooking = new Booking({
                clientName,
                clientEmail,
                clientPhone,
                service,
                date: new Date(date),  // Konversi string ke Date
                time,
                bookingType,
            });

            console.log('Received data:', req.body);

            await newBooking.save();

            res.status(201).json({
                success: true,
                message: 'Booking created successfully'
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error create booking'
            });
        }
    },
}

module.exports = {
    bookingController,
}