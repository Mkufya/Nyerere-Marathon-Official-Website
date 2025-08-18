const Runner = require('../models/Runner');
const Stats = require('../models/Stats');
const AdminNotification = require('../models/AdminNotification');

// Register a new runner
exports.registerRunner = async (req, res) => {
  try {
    const { name, email, category } = req.body;
    // Create runner
    const runner = await Runner.create({ name, email, category });

    // Update stats (increment total and category)
    let stats = await Stats.findOne();
    if (!stats) stats = await Stats.create({});
    stats.totalParticipants += 1;
    stats.categoryBreakdown.set(category, (stats.categoryBreakdown.get(category) || 0) + 1);
    await stats.save();

    // Create admin notification
    const message = `New registration: ${name} (${email}) for ${category}`;
    await AdminNotification.create({ runnerId: runner._id, message });

    res.status(201).json({ runner });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

// Get all runners (for admin dashboard)
exports.getAllRunners = async (req, res) => {
  try {
    const runners = await Runner.find().sort({ timestamp: -1 });
    res.json(runners);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch runners' });
  }
}; 