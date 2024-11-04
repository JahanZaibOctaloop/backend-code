const Attendance = require('../models/attendance');



exports.TotalAttendance= async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find();
    res.status(200).json({
      success: true,
      data: attendanceRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance records',
      error: error.message
    });
  }
};