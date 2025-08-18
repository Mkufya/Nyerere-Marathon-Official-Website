const AdminNotification = require('../models/AdminNotification');
const Runner = require('../models/Runner');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await AdminNotification.find()
      .sort({ timestamp: -1 })
      .limit(20)
      .populate('runnerId', 'name email category');
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
}; 