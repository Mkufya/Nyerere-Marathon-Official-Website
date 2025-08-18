const express = require('express');
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

// Import routes
const galleryRoutes = require('./routes/galleryRoutes');
const runnerRoutes = require('./routes/runnerRoutes');
const statsRoutes = require('./routes/statsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Mock data for when database is not available
const mockData = {
  gallery: [
    {
      _id: '1',
      title: 'Marathon Start',
      description: 'Runners at the starting line',
      imageUrl: '/uploads/gallery/slider1.jpg',
      category: 'race',
      createdAt: new Date()
    },
    {
      _id: '2',
      title: 'Finish Line',
      description: 'Celebrating at the finish',
      imageUrl: '/uploads/gallery/slider2.jpg',
      category: 'finish',
      createdAt: new Date()
    }
  ],
  stats: {
    totalRunners: 1250,
    totalRegistrations: 1450,
    totalCategories: 4,
    totalResults: 980
  }
};

// Override routes to use mock data
app.use('/api/gallery', (req, res, next) => {
  if (req.method === 'GET') {
    return res.json({
      success: true,
      data: mockData.gallery,
      message: 'Gallery items retrieved successfully (mock data)'
    });
  }
  next();
});

app.use('/api/stats', (req, res, next) => {
  if (req.method === 'GET') {
    return res.json({
      success: true,
      data: mockData.stats,
      message: 'Stats retrieved successfully (mock data)'
    });
  }
  next();
});

// Use original routes for other endpoints
app.use(galleryRoutes);
app.use(runnerRoutes);
app.use(statsRoutes);
app.use(notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running (no-db mode)',
    timestamp: new Date().toISOString(),
    mode: 'no-database',
    note: 'Using mock data. Set up MongoDB for full functionality.'
  });
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📸 Gallery API: http://localhost:${PORT}/api/gallery`);
  console.log(`📊 Stats API: http://localhost:${PORT}/api/stats`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`\n✅ Server started successfully without MongoDB!`);
  console.log(`📝 Using mock data for testing`);
  console.log(`🔧 To enable full functionality, set up MongoDB Atlas or install MongoDB locally`);
}); 