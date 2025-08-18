const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  logoUrl: {
    type: String,
    required: true
  },
  website: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['platinum', 'gold', 'silver', 'bronze', 'partner'],
    default: 'partner'
  },
  priority: {
    type: Number,
    default: 0,
    min: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  sponsorshipAmount: {
    type: Number,
    min: 0
  },
  contactPerson: {
    name: String,
    email: String,
    phone: String
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

sponsorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Sponsor', sponsorSchema);
