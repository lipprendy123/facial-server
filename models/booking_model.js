const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      required: true,
      trim: true,
    },
    clientPhone: {
      type: String,
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service", // Relasi ke serviceSchema
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String, // Format waktu (misal: "14:00")
      required: true,
    },
    bookingType: {
      type: String,
      enum: ["home_calling", "visit_to_clinic"], // Tipe booking
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"], // Status booking
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  const Booking = mongoose.model("Booking", bookingSchema);

  module.exports = {
    Booking
  }