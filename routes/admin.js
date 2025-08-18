const express = require('express');
const jwt = require('jsonwebtoken');
const Race = require('../models/Race');
const Registration = require('../models/Registration');
const User = require('../models/User');
const adminController = require('../controllers/adminController');
const { 
  uploadNews, 
  uploadSponsor, 
  uploadGallery, 
  uploadHighlight, 
  uploadInterview 
} = require('../middleware/upload');
const router = express.Router();

// Middleware to authenticate admin
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'nyerere_marathon_secret', (err, user) => {
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

// Dashboard
router.get('/dashboard', authenticateAdmin, adminController.getDashboardStats);

// News Management
router.get('/news', authenticateAdmin, adminController.getAllNews);
router.post('/news', authenticateAdmin, uploadNews, adminController.createNews);
router.put('/news/:id', authenticateAdmin, uploadNews, adminController.updateNews);
router.delete('/news/:id', authenticateAdmin, adminController.deleteNews);

// Sponsor Management
router.get('/sponsors', authenticateAdmin, adminController.getAllSponsors);
router.post('/sponsors', authenticateAdmin, uploadSponsor, adminController.createSponsor);
router.put('/sponsors/:id', authenticateAdmin, uploadSponsor, adminController.updateSponsor);
router.delete('/sponsors/:id', authenticateAdmin, adminController.deleteSponsor);

// Gallery Management
router.get('/gallery', authenticateAdmin, adminController.getAllGallery);
router.post('/gallery', authenticateAdmin, uploadGallery, adminController.createGalleryItem);
router.put('/gallery/:id', authenticateAdmin, uploadGallery, adminController.updateGalleryItem);
router.delete('/gallery/:id', authenticateAdmin, adminController.deleteGalleryItem);

// Highlight Management
router.get('/highlights', authenticateAdmin, adminController.getAllHighlights);
router.post('/highlights', authenticateAdmin, uploadHighlight, adminController.createHighlight);
router.put('/highlights/:id', authenticateAdmin, uploadHighlight, adminController.updateHighlight);
router.delete('/highlights/:id', authenticateAdmin, adminController.deleteHighlight);

// Interview Management
router.get('/interviews', authenticateAdmin, adminController.getAllInterviews);
router.post('/interviews', authenticateAdmin, uploadInterview, adminController.createInterview);
router.put('/interviews/:id', authenticateAdmin, uploadInterview, adminController.updateInterview);
router.delete('/interviews/:id', authenticateAdmin, adminController.deleteInterview);

// Registration Management
router.get('/registrations', authenticateAdmin, adminController.getRegistrations);
router.put('/registrations/:id/status', authenticateAdmin, adminController.updateRegistrationStatus);

// Results Management
router.get('/results', authenticateAdmin, adminController.getResults);
router.post('/results/upload', authenticateAdmin, adminController.uploadResults);

// Race Management (existing routes)
router.post('/races', authenticateAdmin, async (req, res) => {
  try {
    const race = new Race(req.body);
    await race.save();
    res.status(201).json({ message: 'Race created successfully', race });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/races/:id', authenticateAdmin, async (req, res) => {
  try {
    const race = await Race.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!race) {
      return res.status(404).json({ message: 'Race not found' });
    }
    
    res.json({ message: 'Race updated successfully', race });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/races/:id/registrations', authenticateAdmin, async (req, res) => {
  try {
    const registrations = await Registration.find({ race: req.params.id })
      .populate('participant', 'firstName lastName email phone gender nationality')
      .sort({ registrationDate: -1 });
    
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check-in participant
router.post('/checkin/:registrationId', authenticateAdmin, async (req, res) => {
  try {
    const registration = await Registration.findByIdAndUpdate(
      req.params.registrationId,
      {
        checkedIn: true,
        checkInTime: new Date(),
        status: 'checked_in'
      },
      { new: true }
    );
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    res.json({ message: 'Participant checked in successfully', registration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Management
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments();
    
    res.json({
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id/role', authenticateAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['participant', 'admin', 'volunteer', 'organizer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 