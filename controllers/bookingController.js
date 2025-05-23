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
            const { clientName, clientEmail, clientPhone, service, date, type, time, bookingType, address } = req.body;
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

            
            const startOfDay = new Date(bookingDate.setHours(0, 0, 0, 0))
            const endOfDay = new Date(bookingDate.setHours(23, 59, 59, 99))

            const countBookingToday = await Booking.countDocuments({
                date: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            })

            if (countBookingToday >= 2) {
                return res.json({
                    success: false,
                    message: 'Booking pada hari ini telah penuh, silahkan pilih hari lain'
                })
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
                address,
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

    async updateBooking(req, res) {
        try {
            const { bookingType, address, status } = req.body;
        
            // Validasi: Jika bookingType adalah "home_calling", alamat harus diisi
            if (bookingType === "home_calling" && !address) {
              return res.status(400).json({ message: "Address is required for home calling" });
            }
        
            // Validasi: Status hanya boleh salah satu dari "pending", "confirmed", "cancelled"
            const allowedStatus = ["pending", "confirmed", "cancelled"];
            if (status && !allowedStatus.includes(status)) {
              return res.status(400).json({ message: "Invalid status" });
            }
        
            // Update data booking berdasarkan ID
            const updatedBooking = await Booking.findByIdAndUpdate(
              req.params.id,
              { $set: req.body }, // Update hanya data yang dikirim
              { new: true, runValidators: true } // Mengembalikan data terbaru & menjalankan validasi
            );
        
            if (!updatedBooking) {
              return res.status(404).json({ message: "Booking not found" });
            }
        
            res.json(updatedBooking);
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
    },
    
    async deleteBooking(req, res) {
        try {
            const {id} = req.params;

            const booking = await Booking.findByIdAndDelete({_id: id});

            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                })
            }

            res.status(200).json({
                success: true,
                message: 'Delete data booking success!!'
            })

        } catch (error) {
            console.error("Error: ", error.message);
            return res.status(500).json({
                success: false,
                message: 'Delete data failed',
                error: error.message
            })
        }
    }
     
}

module.exports = {
    bookingController,
}