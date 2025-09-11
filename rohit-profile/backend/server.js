const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // ✅ allows responses to be shared with frontend
}));


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => req.ip === '::1' || req.ip === '127.0.0.1' // Skip rate limiting for localhost
});
app.use('/api/', limiter);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:8080'
];

// Add Vercel domains in production
if (process.env.NODE_ENV === 'production') {
  allowedOrigins.push(/\.vercel\.app$/);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors()); // ✅ handles preflight requests

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/home', require('./routes/home'));
app.use('/api/about', require('./routes/about'));
app.use('/api/services', require('./routes/services'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/testimonials-section', require('./routes/testimonials-section'));
app.use('/api/youtube', require('./routes/youtube'));
app.use('/api/team', require('./routes/team'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/footer', require('./routes/footer'));
app.use('/api/branding', require('./routes/branding'));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/upload', require('./routes/upload'));

// Handle preflight requests
app.options('*', cors());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Portfolio API is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint to check home data (remove in production)
app.get('/api/test/home', async (req, res) => {
  try {
    const HomeSection = require('./models/HomeSection');
    const homeData = await HomeSection.findOne();
    res.json({ 
      message: 'Home data from database',
      data: homeData,
      profileImageExists: !!homeData?.profileImage,
      profileImageValue: homeData?.profileImage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
});