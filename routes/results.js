const express = require('express');
const jwt = require('jsonwebtoken');
const Result = require('../models/Result');
const Registration = require('../models/Registration');
const Race = require('../models/Race');
const User = require('../models/User');
const router = express.Router();

// Middleware to authenticate admin
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    if (user.role !== 'admin' && user.role !== 'organizer') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    req.user = user;
    next();
  });
}

// Start race for a participant (admin only)
router.post('/start', authenticateAdmin, async (req, res) => {
  try {
    const { registrationId, startTime } = req.body;
    
    const registration = await Registration.findById(registrationId)
      .populate('participant')
      .populate('race');
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    // Check if result already exists
    const existingResult = await Result.findOne({ registration: registrationId });
    if (existingResult) {
      return res.status(400).json({ message: 'Race already started for this participant' });
    }
    
    const result = new Result({
      registration: registrationId,
      race: registration.race._id,
      participant: registration.participant._id,
      startTime: startTime || new Date()
    });
    
    await result.save();
    
    // Update registration status
    await Registration.findByIdAndUpdate(registrationId, { status: 'started' });
    
    res.status(201).json({ message: 'Race started', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Finish race for a participant (admin only)
router.post('/finish', authenticateAdmin, async (req, res) => {
  try {
    const { registrationId, finishTime } = req.body;
    
    const result = await Result.findOneAndUpdate(
      { registration: registrationId },
      {
        finishTime: finishTime || new Date(),
        status: 'finished'
      },
      { new: true }
    );
    
    if (!result) {
      return res.status(404).json({ message: 'Race result not found' });
    }
    
    // Update registration status
    await Registration.findByIdAndUpdate(registrationId, { status: 'finished' });
    
    // Calculate positions after finish
    await calculatePositions(result.race);
    
    res.json({ message: 'Race finished', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get race results/leaderboard
router.get('/race/:raceId', async (req, res) => {
  try {
    const { raceId } = req.params;
    const { status = 'finished', gender, ageGroup } = req.query;
    
    let filter = { race: raceId, status };
    
    const results = await Result.find(filter)
      .populate({
        path: 'participant',
        select: 'firstName lastName gender dateOfBirth nationality'
      })
      .populate({
        path: 'registration',
        select: 'bibNumber'
      })
      .sort({ totalTimeSeconds: 1 });
    
    // Filter by gender if specified
    let filteredResults = results;
    if (gender) {
      filteredResults = results.filter(r => r.participant.gender === gender);
    }
    
    res.json(filteredResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get live race status
router.get('/live/:raceId', async (req, res) => {
  try {
    const { raceId } = req.params;
    
    const results = await Result.find({ race: raceId })
      .populate({
        path: 'participant',
        select: 'firstName lastName'
      })
      .populate({
        path: 'registration',
        select: 'bibNumber'
      })
      .sort({ totalTimeSeconds: 1 });
    
    const stats = {
      started: results.filter(r => r.status === 'started').length,
      finished: results.filter(r => r.status === 'finished').length,
      dnf: results.filter(r => r.status === 'dnf').length,
      total: results.length
    };
    
    res.json({ results, stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add checkpoint time (admin only)
router.post('/checkpoint', authenticateAdmin, async (req, res) => {
  try {
    const { registrationId, checkpointName, time, distanceFromStart } = req.body;
    
    const result = await Result.findOne({ registration: registrationId });
    if (!result) {
      return res.status(404).json({ message: 'Race result not found' });
    }
    
    const checkpoint = {
      name: checkpointName,
      time: time || new Date(),
      distanceFromStart
    };
    
    // Calculate split time
    const previousTime = result.checkpoints.length > 0 
      ? result.checkpoints[result.checkpoints.length - 1].time 
      : result.startTime;
    
    const splitMs = new Date(checkpoint.time) - new Date(previousTime);
    const splitMinutes = Math.floor(splitMs / 60000);
    const splitSeconds = Math.floor((splitMs % 60000) / 1000);
    checkpoint.splitTime = `${splitMinutes}:${splitSeconds.toString().padStart(2, '0')}`;
    
    result.checkpoints.push(checkpoint);
    await result.save();
    
    res.json({ message: 'Checkpoint added', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Calculate positions for a race
async function calculatePositions(raceId) {
  try {
    const results = await Result.find({ 
      race: raceId, 
      status: 'finished',
      totalTimeSeconds: { $exists: true } 
    })
    .populate('participant', 'gender dateOfBirth')
    .sort({ totalTimeSeconds: 1 });
    
    // Calculate overall positions
    results.forEach((result, index) => {
      result.overallPosition = index + 1;
    });
    
    // Calculate gender positions
    const maleResults = results.filter(r => r.participant.gender === 'male');
    const femaleResults = results.filter(r => r.participant.gender === 'female');
    
    maleResults.forEach((result, index) => {
      result.genderPosition = index + 1;
    });
    
    femaleResults.forEach((result, index) => {
      result.genderPosition = index + 1;
    });
    
    // Save all updated results
    const updatePromises = results.map(result => result.save());
    await Promise.all(updatePromises);
    
  } catch (error) {
    console.error('Error calculating positions:', error);
  }
}

module.exports = router; 