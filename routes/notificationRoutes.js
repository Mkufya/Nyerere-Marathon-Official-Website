const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get recent admin notifications
router.get('/api/admin/notifications', notificationController.getNotifications);

module.exports = router; 