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
      ref: "Service", 
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String, 
      required: true,
    },
    bookingType: {
      type: String,
      enum: ["home_calling", "visit_to_clinic"], 
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

  module.exports = mongoose.model("Booking", bookingSchema);