const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock races data
const mockRaces = [
  {
    _id: '1',
    name: '5K Fun Run',
    distance: '5K',
    distanceKm: 5,
    description: 'Perfect for beginners and families',
    registrationFee: 15000,
    isActive: true
  },
  {
    _id: '2',
    name: '10K Challenge', 
    distance: '10K',
    distanceKm: 10,
    description: 'City challenge route',
    registrationFee: 25000,
    isActive: true
  },
  {
    _id: '3',
    name: 'Half Marathon',
    distance: 'Half Marathon', 
    distanceKm: 21.1,
    description: 'The classic half marathon',
    registrationFee: 35000,
    isActive: true
  },
  {
    _id: '4',
    name: 'Full Marathon',
    distance: 'Full Marathon',
    distanceKm: 42.2,
    description: 'The ultimate challenge',
    registrationFee: 50000,
    isActive: true
  }
];

// Routes
app.get('/api/races', (req, res) => {
  res.json(mockRaces);
});

app.get('/api/races/:identifier', (req, res) => {
  const { identifier } = req.params;
  
  const distanceMap = {
    '5km': '5K',
    '10km': '10K',
    '21km': 'Half Marathon',
    '42km': 'Full Marathon'
  };
  
  let race = mockRaces.find(r => r._id === identifier);
  
  if (!race && distanceMap[identifier.toLowerCase()]) {
    race = mockRaces.find(r => r.distance === distanceMap[identifier.toLowerCase()]);
  }
  
  if (!race) {
    return res.status(404).json({ message: 'Race not found' });
  }
  
  res.json(race);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api/races`);
}); 