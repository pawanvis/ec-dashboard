const mongoose = require('mongoose');

const brochureRequestSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  courseInterest: String,
  agreeToUpdates: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BrochureRequest', brochureRequestSchema);
