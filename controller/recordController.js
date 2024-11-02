const Record = require('../models/record'); // Ensure the path is correct
const path = require('path');
const fs = require('fs');

exports.addRecord = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      role,
      temporaryAddress,
      permanentAddress,
      policeVerification,
      mobileNumber,
      nextOfKin,
      emergencyContactNumber,
      bloodGroup,
      weaponTrainingRecord,
      experience,
      dateOfBirth,
      dateOfJoining,
      reference,
    } = req.body;

    // Initialize filenames as null in case no file is uploaded
    let salarySlipFilename = null;
    let pictureFilename = null;

    if (req.files && req.files.salarySlip) {
      salarySlipFilename = req.files.salarySlip[0].filename; 
    }

    if (req.files && req.files.picture) {
      // Get the filename from the Multer file object
      pictureFilename = req.files.picture[0].filename; // Only the filename (e.g., 1626795632328-photo.jpg)
    }

    // Create new record instance
    const newRecord = new Record({
      name,
      fatherName,
      role,
      temporaryAddress,
      permanentAddress,
      policeVerification,
      mobileNumber,
      nextOfKin,
      emergencyContactNumber,
      bloodGroup,
      weaponTrainingRecord,
      experience,
      dateOfBirth,
      dateOfJoining,
      reference,
      salarySlip: salarySlipFilename,
      picture: pictureFilename,
    });

    await newRecord.save();

    res.status(201).json({ message: 'Record added successfully', record: newRecord });
  } catch (error) {
    console.error('Error adding record:', error.message);
    res.status(500).json({ error: 'Failed to add record', details: error.message });
  }
};

exports.getAllRecords = async (req, res) => {
    try {
      const records = await Record.find(); // Retrieve all records from the database
      res.status(200).json(records);
    } catch (error) {
      console.error('Error fetching records:', error.message);
      res.status(500).json({ error: 'Failed to fetch records' });
    }
  };


exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Record.findByIdAndDelete(id);

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting record:', error.message);
    res.status(500).json({ error: 'Failed to delete record' });
  }
};

exports.editRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedRecord = await Record.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json({ message: 'Record updated successfully', record: updatedRecord });
  } catch (error) {
    console.error('Error updating record:', error.message);
    res.status(500).json({ error: 'Failed to update record' });
  }
};