const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getHomeSection,
  updateHomeSection,
  toggleHomeVisibility,
  resetHomeSection
} = require('../controllers/homeSectionController');

// Validation middleware
const validateHomeUpdate = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('title').optional().trim().isLength({ min: 2, max: 200 }),
  body('headline').optional().trim().isLength({ min: 5, max: 300 }),
  body('subtitle').optional().trim().isLength({ min: 10, max: 500 }),
  body('stats.projects').optional().trim().isLength({ max: 20 }),
  body('stats.views').optional().trim().isLength({ max: 20 }),
  body('stats.clients').optional().trim().isLength({ max: 20 }),
  body('stats.experience').optional().trim().isLength({ max: 20 }),
  body('isVisible').optional().isBoolean()
];

// Public routes
router.get('/', getHomeSection);

// Private routes (admin only)
router.put('/', auth, validateHomeUpdate, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  updateHomeSection(req, res, next);
});

router.patch('/visibility', auth, toggleHomeVisibility);
router.post('/reset', auth, resetHomeSection);

module.exports = router;