const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  totalParticipants: {
    type: Number,
    default: 0
  },
  categoryBreakdown: {
    type: Map,
    of: Number,
    default: {}
  }
});

module.exports = mongoose.model('Stats', statsSchema); 