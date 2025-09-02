const express = require('express');
const router = express.Router();
const { sayHello } = require('../controllers/helloController');

// Route
router.get('/', sayHello);

module.exports = router;
