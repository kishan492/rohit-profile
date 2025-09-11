const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getTestimonialsSection,
  updateTestimonialsSection,
  toggleTestimonialsVisibility
} = require('../controllers/testimonialsSectionController');

router.get('/', getTestimonialsSection);
router.put('/', auth, updateTestimonialsSection);
router.patch('/visibility', auth, toggleTestimonialsVisibility);

module.exports = router;