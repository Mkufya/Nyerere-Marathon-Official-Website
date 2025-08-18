#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Check if .env file exists, if not create one with default values
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.log('📄 Creating .env file with default configuration...');
  
  const defaultEnv = `# Server Configuration
PORT=3002
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/nyerere_marathon_2025

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production_${Date.now()}
JWT_EXPIRE=30d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (for future use)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
`;

  try {
    fs.writeFileSync(envPath, defaultEnv);
    console.log('✅ .env file created successfully!');
    console.log('⚠️  Make sure to update the JWT_SECRET and database URI for production!');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
    console.log('Please create a .env file manually with the following content:');
    console.log(defaultEnv);
    process.exit(1);
  }
}

// Check if MongoDB is running locally
console.log('🔍 Checking MongoDB connection...');

// Start the server
console.log('🚀 Starting Nyerere Marathon Backend Server...');
console.log('📍 Server will be available at: http://localhost:3002');
console.log('🏥 Health check: http://localhost:3002/api/health');
console.log('💾 Database status: http://localhost:3002/api/db-status');
console.log('🔑 Auth endpoint: http://localhost:3002/api/auth');

// Start the main server
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: { ...process.env }
});

server.on('close', (code) => {
  console.log(`\n🛑 Server stopped with code ${code}`);
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error.message);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down backend server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down backend server...');
  server.kill('SIGTERM');
}); 