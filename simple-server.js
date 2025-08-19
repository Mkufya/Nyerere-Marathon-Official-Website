const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock races data
const races = [
  {
    id: '5k',
    name: '5K Fun Run',
    distance: '5K',
    startTime: '2025-04-26T06:00:00Z',
    registrationFee: 30000,
    maxParticipants: 500,
    currentParticipants: 0,
    registrationOpen: true,
    registrationDeadline: '2025-04-20T23:59:59Z',
    description: 'A fun 5K run perfect for beginners and families'
  },
  {
    id: '10k',
    name: '10K Challenge',
    distance: '10K',
    startTime: '2025-04-26T06:30:00Z',
    registrationFee: 30000,
    maxParticipants: 400,
    currentParticipants: 0,
    registrationOpen: true,
    registrationDeadline: '2025-04-20T23:59:59Z',
    description: 'A challenging 10K race for intermediate runners'
  },
  {
    id: '21k',
    name: '21K Half Marathon',
    distance: 'Half Marathon',
    startTime: '2025-04-26T07:00:00Z',
    registrationFee: 30000,
    maxParticipants: 300,
    currentParticipants: 0,
    registrationOpen: true,
    registrationDeadline: '2025-04-20T23:59:59Z',
    description: 'The classic half marathon distance for serious runners'
  },
  {
    id: '42k',
    name: '42K Full Marathon',
    distance: 'Full Marathon',
    startTime: '2025-04-26T07:30:00Z',
    registrationFee: 30000,
    maxParticipants: 200,
    currentParticipants: 0,
    registrationOpen: true,
    registrationDeadline: '2025-04-20T23:59:59Z',
    description: 'The ultimate marathon distance for elite runners'
  }
];

// Routes
app.get('/api/races', (req, res) => {
  res.json(races);
});

app.get('/api/races/:identifier', (req, res) => {
  const { identifier } = req.params;
  
  const distanceMap = {
    '5km': '5K',
    '10km': '10K',
    '21km': 'Half Marathon',
    '42km': 'Full Marathon'
  };
  
  let race = races.find(r => r.id === identifier);
  
  if (!race && distanceMap[identifier.toLowerCase()]) {
    race = races.find(r => r.distance === distanceMap[identifier.toLowerCase()]);
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