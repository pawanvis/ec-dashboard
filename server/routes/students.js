const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Student = require('../models/Student');

const router = express.Router();

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') cb(null, 'uploads/images/');
    else cb(null, 'uploads/docs/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ▶ Create Student
router.post('/', upload.fields([{ name: 'image' }, { name: 'docFile' }]), async (req, res) => {
  try {
    const { name, fatherName, dob, gender, programApplied, specialization, session, country, academicPartnerCode, endorsementCode } = req.body;

    const image = req.files['image'] ? req.files['image'][0].path.replace(/\\/g, '/') : null;
    const docFile = req.files['docFile'] ? req.files['docFile'][0].path.replace(/\\/g, '/') : null;

    const student = new Student({
      image,
      name,
      fatherName,
      dob,
      gender,
      programApplied,
      specialization,
      session,
      country,
      docFile,
      academicPartnerCode,
      endorsementCode,
    });

    await student.save();
    res.status(201).json({ message: "Student data saved successfully", student });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ▶ Get All Students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ▶ Get Single Student
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Suggested backend route for better querying
router.get('/verify', async (req, res) => {
  try {
    const student = await Student.findOne({
      academicPartnerCode: req.query.academicPartnerCode,
      endorsementCode: req.query.endorsementCode
    });
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ▶ Search Student by Codes
router.get('/search', async (req, res) => {
  try {
    const { academicPartnerCode, endorsementCode } = req.query;
    if (!academicPartnerCode || !endorsementCode) {
      return res.status(400).json({ message: "Both academicPartnerCode and endorsementCode are required" });
    }
    const student = await Student.findOne({ academicPartnerCode, endorsementCode });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ▶ Update Student
router.put('/:id', upload.fields([{ name: 'image' }, { name: 'docFile' }]), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.files['image']) updateData.image = req.files['image'][0].path.replace(/\\/g, '/');
    if (req.files['docFile']) updateData.docFile = req.files['docFile'][0].path.replace(/\\/g, '/');

    const student = await Student.findByIdAndUpdate(id, updateData, { new: true });
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Student updated successfully", student });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ▶ Delete Student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (student.image && fs.existsSync(student.image)) fs.unlinkSync(student.image);
    if (student.docFile && fs.existsSync(student.docFile)) fs.unlinkSync(student.docFile);

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
