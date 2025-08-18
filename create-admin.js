const mongoose = require('mongoose');
const User = require('./models/User');

// Database connection
mongoose.connect('mongodb://localhost:27017/nyerere_marathon', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function createAdmin() {
  try {
    // Admin user details - modify these as needed
    const adminData = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@nyereremarathon.com',
      password: 'admin123',  // Change this password!
      phone: '+255123456789',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'male',
      nationality: 'Tanzania',
      role: 'admin',
      emailVerified: true,
      isActive: true
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('❌ Admin user already exists with this email!');
      console.log('Existing admin:', existingAdmin.email);
      process.exit(1);
    }

    // Create admin user
    const admin = new User(adminData);
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('⚠️  Please change the password after first login');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin(); 