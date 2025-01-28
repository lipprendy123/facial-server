const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  image: { type: String, required: true }, // Nama file image
});

module.exports = mongoose.model("Service", serviceSchema);
