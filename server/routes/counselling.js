const express = require('express');
const router = express.Router();
const Counselling = require('../models/Counselling');

// 📌 POST: Submit a new counselling request
router.post('/', async (req, res) => {
  try {
    const { name, email, phoneCode, phone, agreedToTerms } = req.body;

    if (!name || !email || !phoneCode || !phone || !agreedToTerms) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newCounselling = new Counselling({
      name,
      email,
      phoneCode,
      phone,
      agreedToTerms
    });

    await newCounselling.save();
    res.status(201).json({ message: 'Counselling scheduled successfully', data: newCounselling });
  } catch (err) {
    res.status(500).json({ message: 'Failed to schedule counselling', error: err.message });
  }
});

// 📌 GET: List all counselling requests
router.get('/', async (req, res) => {
  try {
    const records = await Counselling.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch records', error: err.message });
  }
});

// 📌 DELETE: Delete a request by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Counselling.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.status(200).json({ message: 'Deleted successfully', data: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed', error: err.message });
  }
});

module.exports = router;
