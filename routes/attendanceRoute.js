const express = require('express');
const router = express.Router();
const { TotalAttendance, getTodayPresentCount  } = require('../controller/attendanceController');

router.get('/attendance', TotalAttendance);

router.get('/attendance/today-present', getTodayPresentCount);

// router.put('/update-attendance/:id', updateAttendance);

module.exports = router;
