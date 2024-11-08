const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  record_id: mongoose.Schema.Types.ObjectId,
  name: String,
  role: String,
  timestamp: Date,
  verification: {
    method: String,
    confidence: Number,
    anti_spoof_score: Number,
  },
  details: {
    fatherName: String,
    mobileNumber: String,
    bloodGroup: String,
    emergencyContactNumber: String,
  },
  status: String,
  created_at: Date,
}, { collection: 'attendance' });

module.exports = mongoose.model('Attendance', attendanceSchema);
