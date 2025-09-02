const mongoose = require('mongoose');

const partnerCounselingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  emailAddress: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  userMessage: { type: String },
  termsAccepted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PartnerCounseling', partnerCounselingSchema);
