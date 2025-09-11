const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getSections,
  getSectionByType,
  updateSection,
  toggleSectionVisibility
} = require('../controllers/sectionController');

// Public routes
router.get('/', getSections);
router.get('/:type', getSectionByType);

// Private routes (admin only)
router.put('/:type', auth, updateSection);
router.patch('/:type/visibility', auth, toggleSectionVisibility);

module.exports = router;