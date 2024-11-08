const Attendance = require('../models/attendance');



exports.TotalAttendance= async (req, res) => {
  try {
    const records = await Attendance.find({});
    res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getTodayPresentCount = async (req, res) => {
  try {
    // Get the current date without the time part
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59

    // Fetch records where 'status' is 'present' and 'timestamp' is within today's date range
    const presentCount = await Attendance.countDocuments({
      status: 'present',
      timestamp: { $gte: startOfDay, $lt: endOfDay },
    });

    res.status(200).json({ presentCount });
  } catch (err) {
    console.error("Error fetching today's present count:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// const updateAttendance = async (req, res) => {
//   try {
//     const { attendance } = req.body;
//     const updatedRecord = await Record.findByIdAndUpdate(
//       req.params.id,
//       { attendance },
//       { new: true }
//     );
//     res.json({ record: updatedRecord });
//   } catch (error) {
//     console.error('Error updating attendance:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };