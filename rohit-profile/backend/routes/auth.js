const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const router = express.Router();

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    message: 'Too many login attempts, please try again later.',
    retryAfter: 15 * 60 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', loginLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (admin.isLocked) {
      const lockTimeRemaining = Math.ceil((admin.lockUntil - Date.now()) / 1000 / 60);
      return res.status(423).json({ 
        message: `Account is locked. Try again in ${lockTimeRemaining} minutes.`,
        lockTimeRemaining
      });
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      const attemptsLeft = 5 - admin.loginAttempts;
      return res.status(400).json({ 
        message: `Invalid credentials. ${attemptsLeft} attempts remaining.`,
        attemptsLeft
      });
    }

    // Create JWT token
    const payload = {
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '8h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: admin._id,
            email: admin.email,
            name: admin.name,
            role: admin.role
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error.message);
    if (error.message === 'Account is temporarily locked') {
      return res.status(423).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/verify
// @desc    Verify token
// @access  Private
router.get('/verify', require('../middleware/auth'), (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;