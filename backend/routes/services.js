const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getServicesSection,
  updateServicesSection,
  toggleServicesVisibility
} = require('../controllers/servicesSectionController');

// Validation middleware
const validateServicesUpdate = [
  body('sectionTitle').optional().trim().isLength({ max: 200 }),
  body('sectionDescription').optional().trim().isLength({ max: 500 }),
  body('partnersTitle').optional().trim().isLength({ max: 200 }),
  body('partnersList').optional().trim().isLength({ max: 1000 }),
  body('services').optional().isArray(),
  body('isVisible').optional().isBoolean()
];

// Public routes
router.get('/', getServicesSection);

// Private routes (admin only)
router.put('/', auth, validateServicesUpdate, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  updateServicesSection(req, res, next);
});

router.patch('/visibility', auth, toggleServicesVisibility);

module.exports = router;