const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  uid: Number,
  userId: Number,
  timestamp: Date
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
