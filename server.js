const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// Ensure uploads/gallery directory exists
const uploadsDir = path.join(__dirname, 'uploads/gallery');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const galleryRoutes = require('./routes/galleryRoutes');
const runnerRoutes = require('./routes/runnerRoutes');
const statsRoutes = require('./routes/statsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const mediaRoutes = require('./routes/mediaRoutes');

app.use(galleryRoutes);
app.use(runnerRoutes);
app.use(statsRoutes);
app.use(notificationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/media', mediaRoutes);

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!', 
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Database configuration
const databaseConfig = require('./config/database');

// Setup database event listeners
databaseConfig.setupEventListeners();

// Connect to database (optional - server will work without it)
databaseConfig.connect()
  .then(() => {
    console.log('✅ Database connection established');
  })
  .catch(err => {
    console.log('⚠️  Database not available - using temporary storage');
    console.log('💡 Server will work normally with in-memory data');
  });

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📸 Gallery API: http://localhost:${PORT}/api/gallery`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`📊 Admin API: http://localhost:${PORT}/api/admin`);
});