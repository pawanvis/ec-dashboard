const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  image: String,
  name: String,
  fatherName: String,
  dob: Date,
  gender: String,
  programApplied: String,
  specialization: String,
  session: String,
  country: String,
  docFile: String,
  academicPartnerCode: String,
  endorsementCode: String,
});

module.exports = mongoose.model('Student', studentSchema);
