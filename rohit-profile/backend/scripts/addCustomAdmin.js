const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();


const ADMIN_DETAILS = {
  name: 'Rohit Sharma',                    
  email: 'rohitharsh195@gmail.com',       
  password: 'Hell2Heaven@BadBoys564'        
};

const addCustomAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: ADMIN_DETAILS.email });
    if (existingAdmin) {
      console.log('❌ Admin with this email already exists!');
      console.log('Email:', existingAdmin.email);
      process.exit(1);
    }

    // Create new admin
    const admin = new Admin(ADMIN_DETAILS);
    await admin.save();
    
    console.log('✅ Custom admin created successfully!');
    console.log('👤 Name:', ADMIN_DETAILS.name);
    console.log('📧 Email:', ADMIN_DETAILS.email);
    console.log('🔑 Password:', ADMIN_DETAILS.password);
    console.log('🚀 You can now login to the admin dashboard!');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

addCustomAdmin();