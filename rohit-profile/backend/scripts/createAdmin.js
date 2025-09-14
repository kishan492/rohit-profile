const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@portfolio.com' });
    if (existingAdmin) {
      console.log('Admin already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Use this email to login to admin dashboard');
      process.exit(0);
    }

    // Create new admin - CUSTOMIZE THESE DETAILS
    const admin = new Admin({
      name: 'Your Name Here',           // Change to your name
      email: 'your-email@domain.com',   // Change to your email
      password: 'YourSecurePassword123' // Change to your password
    });

    await admin.save();
    
    console.log('✅ Admin created successfully!');
    console.log('📧 Email: admin@portfolio.com');
    console.log('🔑 Password: Admin@123456');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();