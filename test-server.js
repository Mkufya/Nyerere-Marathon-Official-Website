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

// Mock data for testing
const mockGallery = [
  {
    id: 1,
    title: 'Marathon Start',
    description: 'Runners at the starting line',
    imageUrl: '/uploads/gallery/slider1.jpg',
    category: 'race',
    createdAt: new Date()
  },
  {
    id: 2,
    title: 'Finish Line',
    description: 'Celebrating at the finish',
    imageUrl: '/uploads/gallery/slider2.jpg',
    category: 'finish',
    createdAt: new Date()
  }
];

// Mock API routes
app.get('/api/gallery', (req, res) => {
  res.json({
    success: true,
    data: mockGallery,
    message: 'Gallery items retrieved successfully (mock data)'
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalRunners: 1250,
      totalRegistrations: 1450,
      totalCategories: 4,
      totalResults: 980
    },
    message: 'Stats retrieved successfully (mock data)'
  });
});

app.get('/api/runners', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Runners retrieved successfully (mock data)'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running (mock mode)',
    timestamp: new Date().toISOString(),
    mode: 'mock'
  });
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Test Server running on port ${PORT}`);
  console.log(`📸 Gallery API: http://localhost:${PORT}/api/gallery`);
  console.log(`📊 Stats API: http://localhost:${PORT}/api/stats`);
  console.log(`🏃 Runners API: http://localhost:${PORT}/api/runners`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`\n⚠️  This is running in MOCK MODE without MongoDB`);
  console.log(`🔧 To use real database, set up MongoDB Atlas or install MongoDB locally`);
}); 