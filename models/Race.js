const mongoose = require('mongoose');

const raceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  distance: {
    type: String,
    required: true,
    enum: ['5K', '10K', 'Half Marathon', 'Full Marathon']
  },
  distanceKm: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  registrationFee: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'TZS'
  },
  maxParticipants: {
    type: Number,
    required: true
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  ageRestrictions: {
    minAge: {
      type: Number,
      default: 18
    },
    maxAge: {
      type: Number,
      default: 80
    }
  },
  route: {
    startPoint: {
      name: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    endPoint: {
      name: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    waypoints: [{
      name: String,
      coordinates: {
        lat: Number,
        lng: Number
      },
      distanceFromStart: Number
    }]
  },
  prizes: {
    first: {
      male: String,
      female: String
    },
    second: {
      male: String,
      female: String
    },
    third: {
      male: String,
      female: String
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  registrationOpen: {
    type: Boolean,
    default: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Race', raceSchema); 