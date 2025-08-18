// Environment Configuration
// Copy this file to .env and update the values

module.exports = {
  // MongoDB Configuration
  // Option 1: MongoDB Atlas (Cloud) - Recommended
  // Replace 'username', 'password', and 'cluster' with your actual MongoDB Atlas credentials
  MONGODB_URI: 'mongodb+srv://username:password@cluster.mongodb.net/nyerere-marathon?retryWrites=true&w=majority',
  
  // Option 2: Local MongoDB (if you install MongoDB locally)
  // MONGODB_URI: 'mongodb://localhost:27017/nyerere-marathon',
  
  // Server Configuration
  PORT: 3002,
  NODE_ENV: 'development',
  
  // JWT Configuration
  JWT_SECRET: 'your-super-secret-jwt-key-change-this-in-production',
  JWT_EXPIRES_IN: '7d',
  
  // Email Configuration (for notifications)
  EMAIL_HOST: 'smtp.gmail.com',
  EMAIL_PORT: 587,
  EMAIL_USER: 'your-email@gmail.com',
  EMAIL_PASS: 'your-app-password',
  
  // File Upload Configuration
  MAX_FILE_SIZE: 5242880,
  UPLOAD_PATH: './uploads/'
}; 