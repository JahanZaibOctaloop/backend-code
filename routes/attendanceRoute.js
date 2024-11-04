const express = require('express');
const router = express.Router();
const {TotalAttendance} = require('../controller/attendanceController'); 





router.get('/attendance', TotalAttendance);







module.exports = router;