const mongoose = require('mongoose');

const adminNotificationSchema = new mongoose.Schema({
  runnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Runner',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('AdminNotification', adminNotificationSchema); 