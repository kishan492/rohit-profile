const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Admin credentials - CHANGE THESE
const ADMIN_EMAIL = 'rohitharsh195@gmail.com';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('Hell2Heaven@BadBoys564', 10);

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check credentials
    if (email !== ADMIN_EMAIL) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      user: {
        id: 'admin',
        email: ADMIN_EMAIL
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '2h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: 'admin',
            email: ADMIN_EMAIL
          }
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/auth/verify
// @desc    Verify token
// @access  Private
router.get('/verify', require('../middleware/auth'), (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;