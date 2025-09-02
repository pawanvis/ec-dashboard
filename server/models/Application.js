const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  dateOfBirth: { type: String }, // or Date if converting
  phone: { type: String, required: true },
  zipCode: { type: String, required: true },
  status: { type: String, required: true },
  address: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);

