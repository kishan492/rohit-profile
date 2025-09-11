const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getAboutSection,
  updateAboutSection,
  toggleAboutVisibility
} = require('../controllers/aboutSectionController');

// Validation middleware
const validateAboutUpdate = [
  body('sectionTitle').optional().trim().isLength({ max: 200 }),
  body('sectionSubtitle').optional().trim().isLength({ max: 500 }),
  body('mainTitle').optional().trim().isLength({ max: 200 }),
  body('description1').optional().trim().isLength({ max: 1000 }),
  body('description2').optional().trim().isLength({ max: 1000 }),
  body('location').optional().trim().isLength({ max: 100 }),
  body('founded').optional().trim().isLength({ max: 20 }),
  body('teamSize').optional().trim().isLength({ max: 20 }),
  body('awards').optional().trim().isLength({ max: 20 }),
  body('mission').optional().trim().isLength({ max: 500 }),
  body('values').optional().trim().isLength({ max: 1000 }),
  body('isVisible').optional().isBoolean()
];

// Public routes
router.get('/', getAboutSection);

// Private routes (admin only)
router.put('/', auth, validateAboutUpdate, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  updateAboutSection(req, res, next);
});

router.patch('/visibility', auth, toggleAboutVisibility);

module.exports = router;