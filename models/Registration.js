const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  race: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Race',
    required: true
  },
  bibNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'card', 'bank_transfer', 'cash']
  },
  transactionId: String,
  amountPaid: {
    type: Number,
    required: true
  },
  tshirtSize: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    required: true
  },
  dietaryRequirements: {
    type: String,
    trim: true
  },
  estimatedFinishTime: {
    type: String,
    trim: true
  },
  previousMarathonExperience: {
    type: Boolean,
    default: false
  },
  waiver: {
    signed: {
      type: Boolean,
      default: false
    },
    signedDate: Date,
    ipAddress: String
  },
  checkedIn: {
    type: Boolean,
    default: false
  },
  checkInTime: Date,
  status: {
    type: String,
    enum: ['registered', 'confirmed', 'checked_in', 'started', 'finished', 'dnf', 'cancelled'],
    default: 'registered'
  },
  qrCode: String,
  notes: String
}, {
  timestamps: true
});

// Compound index to ensure one registration per user per race
registrationSchema.index({ participant: 1, race: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema); 