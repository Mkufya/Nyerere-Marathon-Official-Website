const express = require('express');
const jwt = require('jsonwebtoken');
const Registration = require('../models/Registration');
const Race = require('../models/Race');
const User = require('../models/User');
const router = express.Router();

// Temporary registration storage for when database is not available
let tempRegistrations = [];

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Register for a race
router.post('/register', authenticateToken, async (req, res) => {
  try {
    const {
      raceId,
      tshirtSize,
      dietaryRequirements,
      estimatedFinishTime,
      previousMarathonExperience,
      paymentMethod,
      emergencyContactName,
      emergencyContactPhone,
      medicalConditions,
      waiverAccepted
    } = req.body;

    // Validate required fields
    if (!raceId || !tshirtSize || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields: raceId, tshirtSize, paymentMethod' });
    }

    if (!waiverAccepted) {
      return res.status(400).json({ message: 'You must accept the waiver to register' });
    }

    if (!emergencyContactName || !emergencyContactPhone) {
      return res.status(400).json({ message: 'Emergency contact information is required' });
    }

    // Check database connection status
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (isDatabaseConnected) {
      // Use database if connected
      // Check if race exists and is open for registration
      const race = await Race.findById(raceId);
      if (!race) {
        return res.status(404).json({ message: 'Race not found' });
      }

      if (!race.registrationOpen) {
        return res.status(400).json({ message: 'Registration is closed for this race' });
      }

      if (new Date() > race.registrationDeadline) {
        return res.status(400).json({ message: 'Registration deadline has passed' });
      }

      if (race.currentParticipants >= race.maxParticipants) {
        return res.status(400).json({ message: 'Race is full' });
      }

      // Check if user is already registered for this race
      const existingRegistration = await Registration.findOne({
        participant: req.user.userId,
        race: raceId
      });

      if (existingRegistration) {
        return res.status(400).json({ message: 'Already registered for this race' });
      }

      // Update user's emergency contact and medical info
      const user = await User.findById(req.user.userId);
      if (user) {
        user.emergencyContact = {
          name: emergencyContactName,
          phone: emergencyContactPhone,
          relationship: 'Emergency Contact'
        };
        
        if (medicalConditions && medicalConditions.trim()) {
          user.medicalInfo = {
            conditions: [medicalConditions],
            medications: user.medicalInfo?.medications || [],
            allergies: user.medicalInfo?.allergies || [],
            bloodType: user.medicalInfo?.bloodType || ''
          };
        }
        
        await user.save();
      }

      // Generate bib number
      const bibNumber = await generateBibNumber(raceId);

      // Create registration
      const registration = new Registration({
        participant: req.user.userId,
        race: raceId,
        bibNumber,
        amountPaid: race.registrationFee,
        tshirtSize,
        dietaryRequirements,
        estimatedFinishTime,
        previousMarathonExperience,
        paymentMethod,
        waiver: {
          signed: true,
          signedDate: new Date(),
          ipAddress: req.ip || req.connection.remoteAddress
        },
        status: 'registered'
      });

      await registration.save();

      // Update race participant count
      await Race.findByIdAndUpdate(raceId, {
        $inc: { currentParticipants: 1 }
      });

      res.status(201).json({
        message: 'Registration successful',
        registration: {
          id: registration._id,
          bibNumber: registration.bibNumber,
          paymentStatus: registration.paymentStatus,
          amountPaid: registration.amountPaid
        }
      });
    } else {
      // Use temporary storage when database is not available
      console.log('⚠️  Database not connected, using temporary storage for race registration');
      
      // Find race in temporary race data
      const tempRaces = [
        {
          id: 'temp_race_5k',
          name: '5K Fun Run',
          distance: '5K',
          startTime: '2025-12-15T06:00:00Z',
          registrationFee: 30000,
          maxParticipants: 500,
          currentParticipants: 0,
          registrationOpen: true,
          registrationDeadline: '2025-12-10T23:59:59Z',
          description: 'A fun 5K run perfect for beginners and families',
          isActive: true
        },
        {
          id: 'temp_race_10k',
          name: '10K Challenge',
          distance: '10K',
          startTime: '2025-12-15T06:30:00Z',
          registrationFee: 30000,
          maxParticipants: 400,
          currentParticipants: 0,
          registrationOpen: true,
          registrationDeadline: '2025-12-10T23:59:59Z',
          description: 'A challenging 10K race for intermediate runners',
          isActive: true
        },
        {
          id: 'temp_race_21k',
          name: '21K Half Marathon',
          distance: 'Half Marathon',
          startTime: '2025-12-15T07:00:00Z',
          registrationFee: 30000,
          maxParticipants: 300,
          currentParticipants: 0,
          registrationOpen: true,
          registrationDeadline: '2025-12-10T23:59:59Z',
          description: 'The classic half marathon distance for serious runners',
          isActive: true
        },
        {
          id: 'temp_race_42k',
          name: '42K Full Marathon',
          distance: 'Full Marathon',
          startTime: '2025-12-15T07:30:00Z',
          registrationFee: 30000,
          maxParticipants: 200,
          currentParticipants: 0,
          registrationOpen: true,
          registrationDeadline: '2025-12-10T23:59:59Z',
          description: 'The ultimate marathon distance for elite runners',
          isActive: true
        }
      ];
      
      const race = tempRaces.find(r => r.id === raceId);
      if (!race) {
        return res.status(404).json({ message: 'Race not found' });
      }

      if (!race.registrationOpen) {
        return res.status(400).json({ message: 'Registration is closed for this race' });
      }

      if (new Date() > new Date(race.registrationDeadline)) {
        return res.status(400).json({ message: 'Registration deadline has passed' });
      }

      if (race.currentParticipants >= race.maxParticipants) {
        return res.status(400).json({ message: 'Race is full' });
      }

      // Check if user is already registered for this race
      const existingRegistration = tempRegistrations.find(reg => 
        reg.participant === req.user.userId && reg.race === raceId
      );

      if (existingRegistration) {
        return res.status(400).json({ message: 'Already registered for this race' });
      }

      // Generate bib number for temporary registration
      const bibNumber = `TEMP${Date.now()}${Math.floor(Math.random() * 1000)}`;

      // Create temporary registration
      const registrationId = `temp_reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newRegistration = {
        id: registrationId,
        participant: req.user.userId,
        race: raceId,
        bibNumber,
        amountPaid: race.registrationFee,
        tshirtSize,
        dietaryRequirements,
        estimatedFinishTime,
        previousMarathonExperience,
        paymentMethod,
        emergencyContact: {
          name: emergencyContactName,
          phone: emergencyContactPhone
        },
        medicalConditions,
        waiver: {
          signed: true,
          signedDate: new Date().toISOString(),
          ipAddress: req.ip || req.connection.remoteAddress
        },
        status: 'registered',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString()
      };

      // Store registration temporarily
      tempRegistrations.push(newRegistration);

      res.status(201).json({
        message: 'Registration successful (temporary storage)',
        registration: {
          id: newRegistration.id,
          bibNumber: newRegistration.bibNumber,
          paymentStatus: newRegistration.paymentStatus,
          amountPaid: newRegistration.amountPaid
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Registration failed'
    });
  }
});

// Get user's registrations
router.get('/my-registrations', authenticateToken, async (req, res) => {
  try {
    // Check database connection status
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (isDatabaseConnected) {
      // Use database if connected
      try {
        const registrations = await Registration.find({
          participant: req.user.userId
        }).populate('race', 'name distance startTime registrationFee');

        res.json(registrations);
      } catch (error) {
        console.error('Database registration query error:', error);
        // If database query fails, fall back to temporary storage
        console.log('⚠️  Database query failed, falling back to temporary storage');
        return handleTempRegistrations(req, res);
      }
    } else {
      // Use temporary storage when database is not available
      console.log('⚠️  Database not connected, using temporary storage for user registrations');
      return handleTempRegistrations(req, res);
    }
  } catch (error) {
    console.error('Registration retrieval error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Failed to retrieve registrations'
    });
  }
});

// Helper function to handle temporary registrations
function handleTempRegistrations(req, res) {
  const userRegistrations = tempRegistrations.filter(reg => 
    reg.participant === req.user.userId
  );

  // Enhance with race details from temporary race data
  const tempRaces = [
    { id: 'temp_race_5k', name: '5K Fun Run', distance: '5K', startTime: '2025-12-15T06:00:00Z', registrationFee: 30000 },
    { id: 'temp_race_10k', name: '10K Challenge', distance: '10K', startTime: '2025-12-15T06:30:00Z', registrationFee: 30000 },
    { id: 'temp_race_21k', name: '21K Half Marathon', distance: 'Half Marathon', startTime: '2025-12-15T07:00:00Z', registrationFee: 30000 },
    { id: 'temp_race_42k', name: '42K Full Marathon', distance: 'Full Marathon', startTime: '2025-12-15T07:30:00Z', registrationFee: 30000 }
  ];
  
  const enhancedRegistrations = userRegistrations.map((reg) => {
    const race = tempRaces.find(r => r.id === reg.race);
    if (race) {
      return {
        ...reg,
        race: {
          name: race.name,
          distance: race.distance,
          startTime: race.startTime,
          registrationFee: race.registrationFee
        }
      };
    }
    return reg;
  });

  res.json(enhancedRegistrations);
}

// Get specific registration details
router.get('/registration/:id', authenticateToken, async (req, res) => {
  try {
    // Check database connection status
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (isDatabaseConnected) {
      // Use database if connected
      const registration = await Registration.findOne({
        _id: req.params.id,
        participant: req.user.userId
      }).populate('race');

      if (!registration) {
        return res.status(404).json({ message: 'Registration not found' });
      }

      res.json(registration);
    } else {
      // Use temporary storage when database is not available
      console.log('⚠️  Database not connected, using temporary storage for registration details');
      
      const registration = tempRegistrations.find(reg => 
        reg.id === req.params.id && reg.participant === req.user.userId
      );

      if (!registration) {
        return res.status(404).json({ message: 'Registration not found' });
      }

      // Enhance with race details from temporary race data
      const tempRaces = [
        { id: 'temp_race_5k', name: '5K Fun Run', distance: '5K', startTime: '2025-04-26T06:00:00Z', registrationFee: 30000 },
        { id: 'temp_race_10k', name: '10K Challenge', distance: '10K', startTime: '2025-04-26T06:30:00Z', registrationFee: 30000 },
        { id: 'temp_race_21k', name: '21K Half Marathon', distance: 'Half Marathon', startTime: '2025-04-26T07:00:00Z', registrationFee: 30000 },
        { id: 'temp_race_42k', name: '42K Full Marathon', distance: 'Full Marathon', startTime: '2025-04-26T07:30:00Z', registrationFee: 30000 }
      ];
      
      const race = tempRaces.find(r => r.id === registration.race);
      if (race) {
        registration.race = race;
      }

      res.json(registration);
    }
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update payment status (webhook endpoint for payment providers)
router.post('/payment-callback', async (req, res) => {
  try {
    const { transactionId, status, registrationId } = req.body;

    // Check database connection status
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (isDatabaseConnected) {
      // Use database if connected
      const registration = await Registration.findById(registrationId);
      if (!registration) {
        return res.status(404).json({ message: 'Registration not found' });
      }

      registration.paymentStatus = status;
      registration.transactionId = transactionId;

      if (status === 'completed') {
        registration.status = 'confirmed';
      }

      await registration.save();
    } else {
      // Use temporary storage when database is not available
      console.log('⚠️  Database not connected, using temporary storage for payment callback');
      
      const registration = tempRegistrations.find(reg => reg.id === registrationId);
      if (!registration) {
        return res.status(404).json({ message: 'Registration not found' });
      }

      registration.paymentStatus = status;
      registration.transactionId = transactionId;

      if (status === 'completed') {
        registration.status = 'confirmed';
      }
    }

    res.json({ message: 'Payment status updated' });
  } catch (error) {
    console.error('Payment callback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate bib number
async function generateBibNumber(raceId) {
  try {
    // Check database connection status
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (isDatabaseConnected) {
      // Use database if connected
      const lastRegistration = await Registration.findOne({ race: raceId })
        .sort({ bibNumber: -1 })
        .limit(1);

      let nextBibNumber = 1;
      if (lastRegistration && lastRegistration.bibNumber) {
        // Extract number from bib number (assuming format like "RACE001")
        const lastNumber = parseInt(lastRegistration.bibNumber.replace(/\D/g, ''));
        nextBibNumber = lastNumber + 1;
      }

      return `RACE${nextBibNumber.toString().padStart(3, '0')}`;
    } else {
      // Use temporary storage when database is not available
      const raceRegistrations = tempRegistrations.filter(reg => reg.race === raceId);
      const nextBibNumber = raceRegistrations.length + 1;
      return `TEMP${nextBibNumber.toString().padStart(3, '0')}`;
    }
  } catch (error) {
    console.error('Error generating bib number:', error);
    return `TEMP${Date.now()}`;
  }
}

module.exports = router; 