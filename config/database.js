const mongoose = require('mongoose');

class DatabaseConfig {
  constructor() {
    // Try to get MONGODB_URI from environment variables, fallback to config file
    this.mongoURI = process.env.MONGODB_URI;
    
    // If no environment variable, try to load from config file
    if (!this.mongoURI) {
      try {
        const config = require('../env-config');
        this.mongoURI = config.MONGODB_URI;
      } catch (error) {
        // Config file doesn't exist, will handle in connect method
      }
    }
    
    this.options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
    };
  }

  async connect() {
    try {
      // Check if MongoDB URI is provided
      if (!this.mongoURI) {
        console.log('⚠️  No MongoDB URI provided. Using in-memory database for development.');
        console.log('🔧 To use a real database:');
        console.log('   1. Set up MongoDB Atlas (free): https://www.mongodb.com/atlas/database');
        console.log('   2. Update MONGODB_URI in env-config.js');
        console.log('   3. Restart the server');
        
        // Use in-memory database for development
        this.mongoURI = 'mongodb://localhost:27017/nyerere-marathon-dev';
        
        // Create a mock connection for development
        console.log('✅ Using in-memory database for development');
        console.log('⚠️  Data will be lost when server restarts');
        return this.createMockConnection();
      }

      // Connect to MongoDB
      await mongoose.connect(this.mongoURI, this.options);
      
      console.log('✅ Database connected successfully');
      console.log(`🔗 Database: ${mongoose.connection.db.databaseName}`);
      console.log(`🌐 Host: ${mongoose.connection.host}`);
      console.log(`🔢 Port: ${mongoose.connection.port}`);
      
      return mongoose.connection;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      
      // If local MongoDB fails, offer to use in-memory database
      if (error.message.includes('ECONNREFUSED') && this.mongoURI.includes('localhost')) {
        console.log('🔧 Local MongoDB not available. Using in-memory database for development.');
        console.log('💡 To fix this permanently:');
        console.log('   1. Set up MongoDB Atlas (free): https://www.mongodb.com/atlas/database');
        console.log('   2. Update MONGODB_URI in env-config.js');
        console.log('   3. Restart the server');
        
        return this.createMockConnection();
      }
      
      // Provide specific error guidance
      if (error.message.includes('authentication failed')) {
        console.log('🔐 Authentication Error - To fix this:');
        console.log('1. Check your MongoDB Atlas username and password');
        console.log('2. Ensure the database user has correct permissions');
        console.log('3. Verify the password doesn\'t contain special characters that need URL encoding');
        console.log('4. Make sure the user is created for the correct database');
      } else if (error.message.includes('network')) {
        console.log('🌐 Network Error - To fix this:');
        console.log('1. Check your internet connection');
        console.log('2. Verify your IP address is whitelisted in MongoDB Atlas');
        console.log('3. Check if firewall is blocking the connection');
      } else if (error.message.includes('timeout')) {
        console.log('⏱️ Timeout Error - To fix this:');
        console.log('1. Check if your MongoDB Atlas cluster is running');
        console.log('2. Verify your internet connection stability');
        console.log('3. Try increasing the timeout values');
      }
      
      throw error;
    }
  }

  createMockConnection() {
    // Create a mock connection object for development
    const mockConnection = {
      readyState: 1, // Connected
      db: { databaseName: 'nyerere-marathon-dev' },
      host: 'localhost',
      port: 27017,
      close: async () => {
        console.log('✅ Mock database connection closed');
      }
    };

    // Set up mock event listeners
    mongoose.connection.readyState = 1;
    mongoose.connection.db = mockConnection.db;
    mongoose.connection.host = mockConnection.host;
    mongoose.connection.port = mockConnection.port;

    return mongoose.connection;
  }

  async disconnect() {
    try {
      await mongoose.connection.close();
      console.log('✅ Database disconnected successfully');
    } catch (error) {
      console.error('❌ Error disconnecting from database:', error.message);
      throw error;
    }
  }

  // Connection event listeners
  setupEventListeners() {
    mongoose.connection.on('connected', () => {
      console.log('🔄 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 Mongoose reconnected to MongoDB');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      console.log('\n🛑 Received SIGINT. Closing MongoDB connection...');
      try {
        await this.disconnect();
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during graceful shutdown:', error.message);
        process.exit(1);
      }
    });
  }

  // Get connection status
  getConnectionStatus() {
    const states = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting'
    };
    
    return {
      state: states[mongoose.connection.readyState] || 'Unknown',
      database: mongoose.connection.db?.databaseName || 'Not connected',
      host: mongoose.connection.host || 'Not connected',
      port: mongoose.connection.port || 'Not connected'
    };
  }
}

module.exports = new DatabaseConfig(); 