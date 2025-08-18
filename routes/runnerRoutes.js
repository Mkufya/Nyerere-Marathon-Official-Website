const express = require('express');
const router = express.Router();
const runnerController = require('../controllers/runnerController');

// Register a new runner
router.post('/api/runners/register', runnerController.registerRunner);

// Get all runners (admin)
router.get('/api/runners', runnerController.getAllRunners);

module.exports = router; 