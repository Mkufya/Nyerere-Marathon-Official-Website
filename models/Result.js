const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: true
  },
  race: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Race',
    required: true
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  finishTime: {
    type: Date
  },
  totalTime: {
    type: String // Format: HH:MM:SS
  },
  totalTimeSeconds: {
    type: Number // Total time in seconds for easy sorting
  },
  status: {
    type: String,
    enum: ['started', 'finished', 'dnf', 'disqualified'],
    default: 'started'
  },
  overallPosition: {
    type: Number
  },
  genderPosition: {
    type: Number
  },
  ageGroupPosition: {
    type: Number
  },
  ageGroup: {
    type: String
  },
  checkpoints: [{
    name: String,
    time: Date,
    splitTime: String,
    distanceFromStart: Number
  }],
  pace: {
    type: String // Format: MM:SS per km
  },
  notes: String,
  officialTime: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate total time when finish time is set
resultSchema.pre('save', function(next) {
  if (this.finishTime && this.startTime) {
    const totalMs = this.finishTime - this.startTime;
    this.totalTimeSeconds = Math.floor(totalMs / 1000);
    
    const hours = Math.floor(this.totalTimeSeconds / 3600);
    const minutes = Math.floor((this.totalTimeSeconds % 3600) / 60);
    const seconds = this.totalTimeSeconds % 60;
    
    this.totalTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Result', resultSchema); 