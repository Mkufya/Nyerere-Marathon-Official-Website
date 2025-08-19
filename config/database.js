const mongoose = require('mongoose');

const connect = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nyerere_marathon';
    
    // Remove deprecated options
    const options = {
      // Removed useNewUrlParser and useUnifiedTopology as they're deprecated
    };

    await mongoose.connect(mongoUri, options);
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    console.log('\n🔧 To fix this issue:');
    console.log('1. Set MONGODB_URI environment variable');
    console.log('2. Or install MongoDB locally and start it');
    console.log('3. Or use MongoDB Atlas (cloud database)');
    console.log('\n⚠️  Server will continue running with temporary storage');
  }
};

const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ Database disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error.message);
  }
};

const setupEventListeners = () => {
  mongoose.connection.on('connected', () => {
    console.log('✅ Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  Mongoose disconnected from MongoDB');
  });

  process.on('SIGINT', async () => {
    await disconnect();
    process.exit(0);
  });
};

module.exports = {
  connect,
  disconnect,
  setupEventListeners
}; 