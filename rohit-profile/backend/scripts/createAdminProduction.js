const mongoose = require('mongoose');
const Admin = require('../models/Admin');

// Use your production MongoDB URI
const MONGO_URI = 'your-production-mongodb-uri-here';

const ADMIN_DETAILS = {
  name: 'Rohit Sharma',                    
  email: 'rohitharsh195@gmail.com',       
  password: 'Hell2Heaven@BadBoys564'        
};

const createAdminProduction = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to Production MongoDB');

    const existingAdmin = await Admin.findOne({ email: ADMIN_DETAILS.email });
    if (existingAdmin) {
      console.log('❌ Admin already exists!');
      console.log('Email:', existingAdmin.email);
      process.exit(1);
    }

    const admin = new Admin(ADMIN_DETAILS);
    await admin.save();
    
    console.log('✅ Production admin created successfully!');
    console.log('👤 Name:', ADMIN_DETAILS.name);
    console.log('📧 Email:', ADMIN_DETAILS.email);
    console.log('🔑 Password:', ADMIN_DETAILS.password);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

createAdminProduction();