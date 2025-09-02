const mongoose = require('mongoose');

const counsellingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneCode: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  agreedToTerms: {
    type: Boolean,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Counselling', counsellingSchema);
