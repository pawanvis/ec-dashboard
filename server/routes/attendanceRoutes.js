const express = require('express');
const router = express.Router();
const { fetchAttendance } = require('../controllers/attendanceController');

router.get('/fetch', fetchAttendance);

module.exports = router;
