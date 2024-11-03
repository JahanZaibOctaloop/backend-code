const Record = require('../models/record'); // Adjust path as needed
const User = require('../models/User');     // Adjust path as needed

exports.getDashboardStats = async (req, res) => {
  try {
    // Count total records
    const totalRecords = await Record.countDocuments();

    // Count records added today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
    const todayRecords = await Record.countDocuments({ createdAt: { $gte: today } });

    // Count total users
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      totalRecords,
      todayRecords,
      totalUsers,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
