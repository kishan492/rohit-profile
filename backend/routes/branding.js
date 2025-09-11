const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getSiteBranding,
  updateSiteBranding
} = require('../controllers/siteBrandingController');

// Validation middleware
const validateBrandingUpdate = [
  body('siteName').optional().trim().isLength({ min: 1, max: 100 }),
  body('logoText').optional().trim().isLength({ min: 1, max: 50 }),
  body('browserTitle').optional().trim().isLength({ min: 1, max: 200 }),
  body('metaDescription').optional().trim().isLength({ max: 300 })
];

// Public routes
router.get('/', getSiteBranding);

// Private routes (admin only)
router.put('/', auth, validateBrandingUpdate, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  updateSiteBranding(req, res, next);
});

module.exports = router;