const express = require('express');
const Race = require('../models/Race');
const Registration = require('../models/Registration');
const mongoose = require('mongoose');
const router = express.Router();

// Temporary race data when database is not connected
const tempRaces = [
  {
    id: 'temp_race_5k',
    name: '5K Fun Run',
    distance: '5K',
    startTime: '2025-12-15T06:00:00Z',
    registrationFee: 15000,
    maxParticipants: 500,
    currentParticipants: 0,
    registrationOpen: true,
    registrationDeadline: '2025-12-10T23:59:59Z',
    description: 'A fun 5K run perfect for beginners and families',
    isActive: true,
    prizes: {
      firstPlace: 100000,
      secondPlace: 50000,
      thirdPlace: 25000
    }
  },
  {
    id: 'temp_race_10k',
    name: '10K Challenge',
    distance: '10K',
    startTime: '2025-12-15T06:30:00Z',
    registrationFee: 25000,
    maxParticipants: 400,
    currentParticipants: 0,
    registrationOpen: true,
    registrationDeadline: '2025-12-10T23:59:59Z',
    description: 'A challenging 10K race for intermediate runners',
    isActive: true,
    prizes: {
      firstPlace: 200000,
      secondPlace: 100000,
      thirdPlace: 50000
    }
  },
  {
    id: 'temp_race_21k',
    name: '21K Half Marathon',
    distance: 'Half Marathon',
    startTime: '2025-12-15T07:00:00Z',
    registrationFee: 35000,
    maxParticipants: 300,
    currentParticipants: 0,
    registrationOpen: true,
    registrationDeadline: '2025-12-10T23:59:59Z',
    description: 'The classic half marathon distance for serious runners',
    isActive: true,
    prizes: {
      firstPlace: 500000,
      secondPlace: 250000,
      thirdPlace: 125000
    }
  },
  {
    id: 'temp_race_42k',
    name: '42K Full Marathon',
    distance: 'Full Marathon',
    startTime: '2025-12-15T07:30:00Z',
    registrationFee: 50000,
    maxParticipants: 200,
    currentParticipants: 0,
    registrationOpen: true,
    registrationDeadline: '2025-12-10T23:59:59Z',
    description: 'The ultimate marathon challenge - 42.195 kilometers',
    isActive: true,
    prizes: {
      firstPlace: 1000000,
      secondPlace: 500000,
      thirdPlace: 250000
    }
  }
];

// Get all active races
router.get('/', async (req, res) => {
  try {
    // Check database connection status
    const isDatabaseConnected = mongoose.connection.readyState === 1;
    
    if (isDatabaseConnected) {
      // Use database if connected
      const races = await Race.find({ isActive: true }).sort({ startTime: 1 });
      res.json(races);
    } else {
      // Use temporary race data when database is not connected
      console.log('⚠️  Database not connected, using temporary race data');
      const activeRaces = tempRaces.filter(race => race.isActive);
      res.json(activeRaces);
    }
  } catch (error) {
    console.error('Error fetching races:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single race by ID or distance
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Check database connection status
    const isDatabaseConnected = mongoose.connection.readyState === 1;
    
    if (isDatabaseConnected) {
      // Use database if connected
      let race;

      // Check if identifier is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(identifier)) {
        race = await Race.findById(identifier);
      } else {
        // Handle distance-based queries (5km, 10km, 21km, 42km)
        const distanceMap = {
          '5km': '5K',
          '10km': '10K', 
          '21km': 'Half Marathon',
          '42km': 'Full Marathon'
        };
        
        const mappedDistance = distanceMap[identifier.toLowerCase()];
        if (mappedDistance) {
          race = await Race.findOne({ distance: mappedDistance, isActive: true });
        }
      }

      if (!race) {
        return res.status(404).json({ message: 'Race not found' });
      }
      
      res.json(race);
    } else {
      // Use temporary race data when database is not connected
      console.log('⚠️  Database not connected, using temporary race data');
      
      let race;
      
      // Check if identifier matches a temp race ID
      if (identifier.startsWith('temp_race_')) {
        race = tempRaces.find(r => r.id === identifier);
      } else {
        // Handle distance-based queries (5km, 10km, 21km, 42km)
        const distanceMap = {
          '5km': '5K',
          '10km': '10K', 
          '21km': 'Half Marathon',
          '42km': 'Full Marathon'
        };
        
        const mappedDistance = distanceMap[identifier.toLowerCase()];
        if (mappedDistance) {
          race = tempRaces.find(r => r.distance === mappedDistance && r.isActive);
        }
      }

      if (!race) {
        return res.status(404).json({ message: 'Race not found' });
      }
      
      res.json(race);
    }
  } catch (error) {
    console.error('Error fetching race:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get race statistics
router.get('/:identifier/stats', async (req, res) => {
  try {
    const { identifier } = req.params;
    let race;

    // Check if identifier is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      race = await Race.findById(identifier);
    } else {
      // Handle distance-based queries
      const distanceMap = {
        '5km': '5K',
        '10km': '10K',
        '21km': 'Half Marathon',
        '42km': 'Full Marathon'
      };
      
      const mappedDistance = distanceMap[identifier.toLowerCase()];
      if (mappedDistance) {
        race = await Race.findOne({ distance: mappedDistance, isActive: true });
      }
    }

    if (!race) {
      return res.status(404).json({ message: 'Race not found' });
    }

    const registrations = await Registration.find({ race: race._id });
    const stats = {
      totalRegistrations: registrations.length,
      confirmedRegistrations: registrations.filter(r => r.paymentStatus === 'completed').length,
      pendingPayments: registrations.filter(r => r.paymentStatus === 'pending').length,
      maleParticipants: 0,
      femaleParticipants: 0,
      availableSpots: race.maxParticipants - race.currentParticipants
    };

    // Get gender distribution
    if (registrations.length > 0) {
      const participantIds = registrations.map(r => r.participant);
      const User = require('../models/User');
      const participants = await User.find({ _id: { $in: participantIds } });
      
      stats.maleParticipants = participants.filter(p => p.gender === 'male').length;
      stats.femaleParticipants = participants.filter(p => p.gender === 'female').length;
    }

    res.json(stats);
  } catch (error) {
    console.error('Error fetching race stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 