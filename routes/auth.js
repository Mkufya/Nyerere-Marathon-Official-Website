const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// Temporary in-memory storage for when database is not available
let tempUsers = [
  // Pre-populated test admin user
  {
    id: 'admin_test_001',
    firstName: 'Test',
    lastName: 'Admin',
    email: 'admin@nyerere.com',
    password: 'admin123',  // In production, this should be hashed
    phone: '+255123456789',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    nationality: 'Tanzania',
    role: 'admin',
    isActive: true,
    emailVerified: true,
    createdAt: new Date().toISOString()
  }
];

// Helper function to reset admin user (for development)
function resetAdminUser() {
  const adminIndex = tempUsers.findIndex(u => u.email === 'admin@nyerere.com');
  if (adminIndex !== -1) {
    tempUsers[adminIndex] = {
      id: 'admin_test_001',
      firstName: 'Test',
      lastName: 'Admin',
      email: 'admin@nyerere.com',
      password: 'admin123',
      phone: '+255123456789',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      nationality: 'Tanzania',
      role: 'admin',
      isActive: true,
      emailVerified: true,
      createdAt: new Date().toISOString()
    };
    console.log('✅ Admin user reset to default credentials');
  }
}

// Register new user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('phone').isLength({ min: 10 }),
  body('dateOfBirth').isISO8601(),
  body('gender').isIn(['male', 'female']),
  body('nationality').trim().isLength({ min: 1 }),
  body('role').optional().isIn(['participant']).custom((value) => {
    if (value && value !== 'participant') {
      throw new Error('Public registration only allows participant role');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, phone, dateOfBirth, gender, nationality, role } = req.body;

    // Security: Only allow participant role for public registration
    if (role && role !== 'participant') {
      return res.status(403).json({ message: 'Unauthorized: Only participant registration is allowed' });
    }

    // Check database connection status
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (isDatabaseConnected) {
      // Use database if connected
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Create new user
      const user = new User({
        firstName,
        lastName,
        email,
        password,
        phone,
        dateOfBirth,
        gender,
        nationality,
        role: role || 'participant'  // Default to participant if not specified
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'nyerere_marathon_secret',
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );

      // Generate verification token and send email
      const crypto = require('crypto');
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.verificationToken = verificationToken;
      await user.save();

      // Send verification email
      try {
        await sendVerificationEmail(user.email, user.firstName, verificationToken);
        console.log('✅ Verification email sent to:', user.email);
      } catch (emailError) {
        console.error('❌ Failed to send verification email:', emailError);
      }

      res.status(201).json({
        message: 'User registered successfully. Please check your email for verification.',
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          nationality: user.nationality,
          role: user.role,
          isActive: user.isActive,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt
        }
      });
    } else {
      // Use temporary in-memory storage when database is not available
      console.log('⚠️  Database not connected, using temporary storage for registration');
      
      // Check if user already exists in temporary storage
      const existingUser = tempUsers.find(user => user.email === email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Create user object for temporary storage
      const userId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newUser = {
        id: userId,
        firstName,
        lastName,
        email,
        password, // In real implementation, this should be hashed
        phone,
        dateOfBirth,
        gender,
        nationality,
        role: role || 'participant',  // Use the actual role from request
        isActive: true,
        emailVerified: false,
        createdAt: new Date().toISOString()
      };

      // Store user temporarily
      tempUsers.push(newUser);

      // Generate verification token and send email
      const crypto = require('crypto');
      const verificationToken = crypto.randomBytes(32).toString('hex');
      newUser.verificationToken = verificationToken;

      // Send verification email
      try {
        await sendVerificationEmail(newUser.email, newUser.firstName, verificationToken);
        console.log('✅ Verification email sent to:', newUser.email);
      } catch (emailError) {
        console.error('❌ Failed to send verification email:', emailError);
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, role: newUser.role },
        process.env.JWT_SECRET || 'nyerere_marathon_secret',
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );

      res.status(201).json({
        message: 'User registered successfully (temporary storage). Please check your email for verification.',
        token,
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phone: newUser.phone,
          dateOfBirth: newUser.dateOfBirth,
          gender: newUser.gender,
          nationality: newUser.nationality,
          role: newUser.role,
          isActive: newUser.isActive,
          emailVerified: newUser.emailVerified,
          createdAt: newUser.createdAt
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle different types of errors
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    res.status(500).json({ 
      message: 'Server error during registration',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
});

// Admin login
router.post('/admin-login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check database connection status
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    let user;
    if (isDatabaseConnected) {
      // Use database if connected
      user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if user is admin
      if (user.role !== 'admin' && user.role !== 'organizer') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      // Use temporary storage if database is not connected
      user = tempUsers.find(u => u.email === email);
      if (!user || user.password !== password || user.role !== 'admin') {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id || user._id, 
        email: user.email, 
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      process.env.JWT_SECRET || 'nyerere_marathon_secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: user.id || user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify admin token
router.get('/verify-admin', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nyerere_marathon_secret');
    
    // Check if user is admin
    if (decoded.role !== 'admin' && decoded.role !== 'organizer') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    res.json({
      message: 'Token valid',
      user: {
        id: decoded.id,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        email: decoded.email,
        role: decoded.role
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check database connection status
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (isDatabaseConnected) {
      // Use database if connected
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'nyerere_marathon_secret',
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      });
    } else {
      // Use temporary in-memory storage when database is not available
      console.log('⚠️  Database not connected, checking temporary storage for login');
      
      // Find user in temporary storage
      const user = tempUsers.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Simple password comparison (in production, this should be hashed)
      if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'nyerere_marathon_secret',
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );

      res.json({
        message: 'Login successful (temporary storage)',
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Send email verification
router.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check database connection status
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (isDatabaseConnected) {
      // Use database if connected
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.emailVerified) {
        return res.status(400).json({ message: 'Email already verified' });
      }

      // Generate verification token
      const crypto = require('crypto');
      const verificationToken = crypto.randomBytes(32).toString('hex');
      
      // Save verification token
      user.verificationToken = verificationToken;
      await user.save();

      // Send verification email
      await sendVerificationEmail(user.email, user.firstName, verificationToken);

      res.json({ message: 'Verification email sent successfully' });
    } else {
      // Use temporary in-memory storage
      console.log('⚠️  Database not connected, using temporary storage for verification');
      
      const user = tempUsers.find(u => u.email === email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.emailVerified) {
        return res.status(400).json({ message: 'Email already verified' });
      }

      // Generate verification token
      const crypto = require('crypto');
      const verificationToken = crypto.randomBytes(32).toString('hex');
      
      // Save verification token in temporary storage
      user.verificationToken = verificationToken;

      // Send verification email
      await sendVerificationEmail(user.email, user.firstName, verificationToken);

      res.json({ message: 'Verification email sent successfully (temporary storage)' });
    }
  } catch (error) {
    console.error('Send verification error:', error);
    res.status(500).json({ message: 'Server error sending verification email' });
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    // Check database connection status
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (isDatabaseConnected) {
      // Use database if connected
      const user = await User.findOne({ verificationToken: token });
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired verification token' });
      }

      // Mark email as verified
      user.emailVerified = true;
      user.verificationToken = undefined;
      await user.save();

      res.json({ message: 'Email verified successfully' });
    } else {
      // Use temporary in-memory storage
      console.log('⚠️  Database not connected, using temporary storage for verification');
      
      const user = tempUsers.find(u => u.verificationToken === token);
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired verification token' });
      }

      // Mark email as verified
      user.emailVerified = true;
      user.verificationToken = undefined;

      res.json({ message: 'Email verified successfully (temporary storage)' });
    }
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
});

// Email service function
async function sendVerificationEmail(email, firstName, verificationToken) {
  try {
    const nodemailer = require('nodemailer');
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email template
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:4201'}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: `"Nyerere Marathon 2025" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification - Nyerere Marathon 2025',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Welcome to Nyerere Marathon 2025!</h2>
          <p>Dear ${firstName},</p>
          <p>Thank you for registering for the Nyerere Marathon 2025. Please verify your email address to complete your registration.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
          <p style="word-break: break-all; color: #3498db;">${verificationUrl}</p>
          
          <p>This verification link will expire in 24 hours.</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #7f8c8d; font-size: 12px;">
            If you didn't register for the Nyerere Marathon 2025, please ignore this email.
          </p>
        </div>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
}

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // Check database connection status
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (isDatabaseConnected) {
      // Use database if connected
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } else {
      // Use temporary storage when database is not available
      console.log('⚠️  Database not connected, checking temporary storage for profile');
      
      const user = tempUsers.find(u => u.id === req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, emergencyContact, medicalInfo } = req.body;
    
    // Check database connection status
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (isDatabaseConnected) {
      // Use database if connected
      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { firstName, lastName, phone, emergencyContact, medicalInfo },
        { new: true, runValidators: true }
      ).select('-password');

      res.json({ message: 'Profile updated successfully', user });
    } else {
      // Use temporary storage when database is not available
      console.log('⚠️  Database not connected, using temporary storage for profile update');
      
      const userIndex = tempUsers.findIndex(u => u.id === req.user.userId);
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user in temporary storage
      tempUsers[userIndex] = {
        ...tempUsers[userIndex],
        firstName: firstName || tempUsers[userIndex].firstName,
        lastName: lastName || tempUsers[userIndex].lastName,
        phone: phone || tempUsers[userIndex].phone,
        emergencyContact: emergencyContact || tempUsers[userIndex].emergencyContact,
        medicalInfo: medicalInfo || tempUsers[userIndex].medicalInfo
      };

      // Return updated user without password
      const { password, ...userWithoutPassword } = tempUsers[userIndex];
      res.json({ message: 'Profile updated successfully (temporary storage)', user: userWithoutPassword });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin-only route to create privileged users (admin, organizer, volunteer)
router.post('/admin/create-user', authenticateAdmin, [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('phone').isLength({ min: 10 }),
  body('dateOfBirth').isISO8601(),
  body('gender').isIn(['male', 'female']),
  body('nationality').trim().isLength({ min: 1 }),
  body('role').isIn(['admin', 'organizer', 'volunteer', 'participant'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, phone, dateOfBirth, gender, nationality, role } = req.body;

    // Check database connection status
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (isDatabaseConnected) {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Create new user with specified role
      const user = new User({
        firstName,
        lastName,
        email,
        password,
        phone,
        dateOfBirth,
        gender,
        nationality,
        role,
        emailVerified: true  // Admin-created users are pre-verified
      });

      await user.save();

      res.status(201).json({
        message: `${role} user created successfully`,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          nationality: user.nationality,
          role: user.role,
          isActive: user.isActive,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt
        }
      });
    } else {
      // Use temporary storage
      const existingUser = tempUsers.find(user => user.email === email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const userId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newUser = {
        id: userId,
        firstName,
        lastName,
        email,
        password,
        phone,
        dateOfBirth,
        gender,
        nationality,
        role,
        isActive: true,
        emailVerified: true,  // Admin-created users are pre-verified
        createdAt: new Date().toISOString()
      };

      tempUsers.push(newUser);

      res.status(201).json({
        message: `${role} user created successfully (temporary storage)`,
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phone: newUser.phone,
          dateOfBirth: newUser.dateOfBirth,
          gender: newUser.gender,
          nationality: newUser.nationality,
          role: newUser.role,
          isActive: newUser.isActive,
          emailVerified: newUser.emailVerified,
          createdAt: newUser.createdAt
        }
      });
    }
  } catch (error) {
    console.error('Admin user creation error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    res.status(500).json({ 
      message: 'Server error during user creation',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
});

// Change password endpoint
router.put('/change-password', authenticateToken, [
  body('currentPassword').exists().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // Check database connection status
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (isDatabaseConnected) {
      // Use database if connected
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({ message: 'Password updated successfully' });
    } else {
      // Use temporary storage when database is not available
      console.log('⚠️  Database not connected, using temporary storage for password change');
      
      const userIndex = tempUsers.findIndex(u => u.id === req.user.userId);
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Simple password check (in production, this should be hashed)
      if (tempUsers[userIndex].password !== currentPassword) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Update password in temporary storage
      tempUsers[userIndex].password = newPassword;
      console.log('✅ Password updated in temporary storage for user:', tempUsers[userIndex].email);

      res.json({ message: 'Password updated successfully (temporary storage)' });
    }
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error during password change' });
  }
});

// Reset admin user endpoint (for development)
router.post('/reset-admin', async (req, res) => {
  try {
    resetAdminUser();
    res.json({ message: 'Admin user reset to default credentials' });
  } catch (error) {
    console.error('Reset admin error:', error);
    res.status(500).json({ message: 'Server error during admin reset' });
  }
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'nyerere_marathon_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

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

module.exports = router; 