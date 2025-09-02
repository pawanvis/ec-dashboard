const mongoose = require('mongoose');

const fileMetaSchema = new mongoose.Schema({
  originalName: String,
  filename: String,
  path: String,
  mimetype: String,
  size: Number,
}, { _id: false });

const FormSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  dob: String,
  gender: String,
  country: String,
  fatherName: String,
  motherName: String,
  maritalStatus: String,
  highestQualifications: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,

  education_type: String,
  employment_type: String,
  identification_type: String,
  awards_type: String,
  purpose_type: String,

  education_documents: [fileMetaSchema],
  employment_documents: [fileMetaSchema],
  identification_documents: [fileMetaSchema],
  awards_documents: [fileMetaSchema],
  purpose_documents: [fileMetaSchema],
  resume_documents: [fileMetaSchema],
}, { timestamps: true });

module.exports = mongoose.model('Form', FormSchema);
