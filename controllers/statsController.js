const Stats = require('../models/Stats');

exports.getStats = async (req, res) => {
  try {
    let stats = await Stats.findOne();
    if (!stats) stats = await Stats.create({});
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}; 