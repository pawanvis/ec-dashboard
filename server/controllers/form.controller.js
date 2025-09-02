const Form = require('../models/Form');
const path = require('path');
const fs = require('fs');

const mapFiles = (files = []) =>
  files.map(f => ({
    originalName: f.originalname,
    filename: f.filename,
    path: `/uploads/${f.filename}`,
    mimetype: f.mimetype,
    size: f.size,
  }));

// CREATE
exports.createForm = async (req, res) => {
  try {
    const body = req.body;
    const formData = {
      ...body,
      education_documents: mapFiles(req.files?.education_docs),
      employment_documents: mapFiles(req.files?.employment_docs),
      identification_documents: mapFiles(req.files?.identification_docs),
      awards_documents: mapFiles(req.files?.awards_docs),
      purpose_documents: mapFiles(req.files?.purpose_docs),
      resume_documents: mapFiles(req.files?.resume_docs),
    };

    const doc = new Form(formData);
    const saved = await doc.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
};

// LIST
exports.getForms = async (req, res) => {
  try {
    const { page = 1, limit = 20, q } = req.query;
    const skip = (page - 1) * limit;
    const filter = q
      ? {
          $or: [
            { firstName: new RegExp(q, 'i') },
            { lastName: new RegExp(q, 'i') },
            { email: new RegExp(q, 'i') },
            { phone: new RegExp(q, 'i') },
          ],
        }
      : {};
    const [items, total] = await Promise.all([
      Form.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Form.countDocuments(filter),
    ]);
    res.json({ items, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'List failed', error: err.message });
  }
};

// GET ONE
exports.getForm = async (req, res) => {
  try {
    const item = await Form.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Invalid id', error: err.message });
  }
};

// UPDATE
exports.updateForm = async (req, res) => {
  try {
    const allowed = [
      'firstName','lastName','email','phone','dob','gender','country',
      'fatherName','motherName','maritalStatus','highestQualifications',
      'addressLine1','addressLine2','city','state','education_type',
      'employment_type','identification_type','awards_type','purpose_type'
    ];
    const data = {};
    for (let k of allowed) if (k in req.body) data[k] = req.body[k];

    const updated = await Form.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

// DELETE
exports.deleteForm = async (req, res) => {
  try {
    const item = await Form.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });

    const allFiles = [
      ...item.education_documents,
      ...item.employment_documents,
      ...item.identification_documents,
      ...item.awards_documents,
      ...item.purpose_documents,
      ...item.resume_documents,
    ];
    allFiles.forEach(f => {
      const abs = path.join(__dirname, '..', f.path);
      fs.unlink(abs, () => {});
    });

    res.json({ message: 'Deleted', id: item._id });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed', error: err.message });
  }
};
