const mongoose = require('mongoose');

const AcademicPartnerSchema = new mongoose.Schema({
  apCode: { type: String, required: true, unique: true },
  instituteType: { type: String, required: true },
  contactPerson: { type: String, required: true },
  contactNumber: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String, required: true },
  website: { type: String },
  email: { type: String, required: true },
  workPermitArea: { type: String },
  images: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model("AcademicPartner", AcademicPartnerSchema);
