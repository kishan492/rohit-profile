const Testimonial = require('../models/Testimonial');

// @desc    Get all approved testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ 
      status: 'approved' 
    }).sort({ createdAt: -1 });
    
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit customer review
// @route   POST /api/testimonials/review
// @access  Public
const submitReview = async (req, res) => {
  try {
    const { name, role, content, rating } = req.body;
    
    const testimonial = new Testimonial({
      name,
      role,
      content,
      rating,
      isCustomerReview: true,
      status: 'pending'
    });
    
    await testimonial.save();
    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all testimonials (admin)
// @route   GET /api/testimonials/admin
// @access  Private
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update testimonial status
// @route   PATCH /api/testimonials/:id/status
// @access  Private
const updateTestimonialStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTestimonials,
  submitReview,
  getAllTestimonials,
  updateTestimonialStatus,
  deleteTestimonial
};