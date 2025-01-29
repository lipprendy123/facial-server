const mongoose = require("mongoose");

const benefitSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("Benefit", benefitSchema);
 