const cloudinary = require('../middleware/cloudinaryConfig');
const Record = require('../models/record'); // Ensure the path is correct

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

    // Helper function to upload to Cloudinary
    const uploadToCloudinary = (fileBuffer, folder) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: folder },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(fileBuffer);
      });
    };

    // Upload salary slip to Cloudinary if present
    let salarySlipUrl = null;
    if (req.files && req.files.salarySlip) {
      salarySlipUrl = await uploadToCloudinary(req.files.salarySlip[0].buffer, 'salary_slips');
    }

    // Upload picture to Cloudinary if present
    let pictureUrl = null;
    if (req.files && req.files.picture) {
      pictureUrl = await uploadToCloudinary(req.files.picture[0].buffer, 'pictures');
    }

    // Create new record instance with URLs
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
      salarySlip: salarySlipUrl,
      picture: pictureUrl,
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

const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};
exports.editRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    let updatedFields = { ...updates };

    

    if (req.files && req.files.salarySlip && req.files.salarySlip[0]) {
      const salarySlipUrl = await uploadToCloudinary(req.files.salarySlip[0].buffer, 'salary_slips');
      updatedFields.salarySlip = salarySlipUrl;
      console.log('Salary slip uploaded to:', salarySlipUrl);
    }

    if (req.files && req.files.picture && req.files.picture[0]) {
      const pictureUrl = await uploadToCloudinary(req.files.picture[0].buffer, 'pictures');
      updatedFields.picture = pictureUrl;
      console.log('Picture uploaded to:', pictureUrl);
    }


    // Find and update the record
    const updatedRecord = await Record.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json({ message: 'Record updated successfully', record: updatedRecord });
  } catch (error) {
    console.error('Error updating record:', error.message);
    res.status(500).json({ error: 'Failed to update record' });
  }
};

