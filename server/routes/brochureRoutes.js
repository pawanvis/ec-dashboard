const express = require('express');
const router = express.Router();
const brochureController = require('../controllers/brochureController');

// Submit brochure request
router.post('/', brochureController.submitBrochureRequest);

// Get all brochure requests
router.get('/', brochureController.getAllBrochureRequests);

// Get single brochure request
router.get('/:id', brochureController.getBrochureRequest);

// Get delete brochure request
router.delete('/:id', brochureController.deleteBrochureRequest);

module.exports = router;