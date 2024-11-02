const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  name: String,
  fatherName: String,
  role: {
    type: String,
    enum: ['Ex-army', 'Civilian', 'Police', 'CAF'],
  },
  temporaryAddress: String,
  permanentAddress: String,
  policeVerification: Boolean,
  mobileNumber: String,
  nextOfKin: String,
  emergencyContactNumber: String,
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  weaponTrainingRecord: String,
  experience: String,
  dateOfBirth: Date,
  dateOfJoining: Date,
  reference: String,
  salarySlip: String,  // Store path as string
  picture: String,     // Store path as string
});

module.exports = mongoose.model('Record', recordSchema);
