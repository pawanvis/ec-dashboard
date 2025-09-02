const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();
const Event = require('../models/event.model');

// Multer storage config
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  file.mimetype.startsWith('image/')
    ? cb(null, true)
    : cb(new Error('Only images are allowed!'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }
});

// Helper for error handling
const handleError = (res, status, message) => {
  return res.status(status).json({ message });
};

// CREATE EVENT
// CREATE EVENT
router.post('/', upload.single('event_img'), async (req, res) => {
  try {
    const {
      meta_title,
      meta_description,
      meta_keywords,
      event_title,
      event_url,
      author_name,
      category,
      event_date,
      event_description
    } = req.body;

    // Validation
    if (!event_title || !event_description || !event_date) {
      return handleError(res, 400, 'All fields (event_title, event_description, event_date) are required.');
    }
    if (!req.file) {
      return handleError(res, 400, 'Event image is required.');
    }

    const eventData = {
      meta_title,
      meta_description,
      meta_keywords,
      event_title,
      event_url,
      author_name,
      category,
      event_date,
      event_description,
      event_img: req.file.filename
    };

    const newEvent = await Event.create(eventData);
    res.status(201).json(newEvent);
  } catch (err) {
    handleError(res, 400, err.message);
  }
});


// UPDATE EVENT
router.put('/:id', upload.single('event_img'), async (req, res) => {
  try {
    const {
      meta_title,
      meta_description,
      meta_keywords,
      event_title,
      event_url,
      author_name,
      category,
      event_date,
      event_description
    } = req.body;

    const existingEvent = await Event.findById(req.params.id);
    if (!existingEvent) return handleError(res, 404, 'Event not found');

    // Delete old image if new one is uploaded
    if (req.file && existingEvent.event_img) {
      try {
        await fs.unlink(path.join('./uploads', existingEvent.event_img));
      } catch (err) {
        console.warn('Could not delete old image:', err.message);
      }
    }

    const updatedData = {
      meta_title,
      meta_description,
      meta_keywords,
      event_title,
      event_url,
      author_name,
      category,
      event_date,
      event_description,
      ...(req.file && { event_img: req.file.filename }),
      ...(!req.file && existingEvent.event_img && { event_img: existingEvent.event_img })
    };

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id, 
      updatedData, 
      { new: true }
    );
    
    res.json(updatedEvent);
  } catch (err) {
    handleError(res, 400, err.message);
  }
});

// GET ALL EVENTS
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    handleError(res, 500, err.message);
  }
});

// GET SINGLE EVENT
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return handleError(res, 404, 'Event not found');
    res.json(event);
  } catch (err) {
    handleError(res, 500, err.message);
  }
});

// DELETE EVENT
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return handleError(res, 404, 'Event not found');

    if (deletedEvent.event_img) {
      try {
        await fs.unlink(path.join('./uploads', deletedEvent.event_img));
      } catch (err) {
        console.warn('Could not delete image:', err.message);
      }
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    handleError(res, 500, err.message);
  }
});

module.exports = router;
