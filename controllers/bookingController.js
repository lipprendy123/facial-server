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

    async getUserBookings(req, res) {
        try {
            console.log("User ID from request:", req.user ? req.user._id : "No user found"); // Debugging
    
            const userId = req.user._id;
            const bookings = await Booking.find({ user: userId }).populate('service', 'name price description').sort({ date: -1 });
    
            if (!bookings.length) {
                return res.status(404).json({
                    success: false,
                    message: "Tidak ada riwayat booking ditemukan"
                });
            }
    
            return res.json({
                success: true,
                message: "Riwayat booking ditemukan",
                data: bookings
            });
    
        } catch (error) {
            console.error("Error fetching bookings:", error);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
        }
    },
    
    
    async createBooking(req, res) {
        try {
            const { clientName, clientEmail, clientPhone, service, date, type, time, bookingType } = req.body;
            const userId = req.user ? req.user._id : null;
    
            // Cek tipe booking valid
            const allowedBookingTypes = ['home_calling', 'visit_to_clinic'];
            if (!allowedBookingTypes.includes(bookingType)) {
                return res.status(400).json({ success: false, message: 'Invalid booking type' });
            }
    
            // Pastikan service ada
            const serviceExists = await Service.findById(service);
            if (!serviceExists) {
                return res.status(404).json({ success: false, message: 'Service not found' });
            }
    
            // Pastikan tanggal booking valid (tidak bisa booking di masa lalu)
            const bookingDate = new Date(date);
            if (bookingDate < new Date()) {
                return res.status(400).json({ success: false, message: 'Invalid date: Cannot book in the past' });
            }
    
            // Buat booking baru
            const newBooking = new Booking({
                clientName,
                clientEmail,
                clientPhone,
                service,
                date: bookingDate,  // Konversi string ke Date
                time,
                bookingType,
                user: userId,
            });
    
            await newBooking.save();
    
            return res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                data: newBooking
            });
    
        } catch (error) {
            console.error("Error creating booking:", error);
            return res.status(500).json({ success: false, message: 'Error creating booking' });
        }
    },
    

     
}

module.exports = {
    bookingController,
}