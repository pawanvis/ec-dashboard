const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// POST: Create application
router.post('/', async (req, res) => {
  try {
    const newApp = new Application(req.body);
    await newApp.save();
    res.status(201).json({ message: 'Application submitted', data: newApp });
  } catch (err) {
    res.status(500).json({ message: 'Submission failed', error: err.message });
  }
});

// GET: List all applications
router.get('/', async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.status(200).json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applications', error: err.message });
  }
});

// DELETE: Delete an application by ID
router.delete('/:id', async (req, res) => {
  console.log("🔥 DELETE endpoint hit with ID:", req.params.id); // Add this log

  try {
    const deletedApp = await Application.findByIdAndDelete(req.params.id);
    if (!deletedApp) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json({ message: 'Application deleted', data: deletedApp });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete application', error: err.message });
  }
});

module.exports = router;
