const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getTestimonials,
  submitReview,
  getAllTestimonials,
  updateTestimonialStatus,
  deleteTestimonial
} = require('../controllers/testimonialController');

// Public routes
router.get('/', getTestimonials);

// Submit customer review
router.post('/review', [
  body('name').trim().isLength({ min: 2 }),
  body('role').trim().isLength({ min: 2 }),
  body('content').trim().isLength({ min: 10 }),
  body('rating').isInt({ min: 1, max: 5 })
], submitReview);

// Private routes (admin only)
router.get('/admin', auth, getAllTestimonials);
router.patch('/:id/status', auth, updateTestimonialStatus);
router.delete('/:id', auth, deleteTestimonial);

module.exports = router;