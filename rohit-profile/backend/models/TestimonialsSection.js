const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  role: { type: String, default: '' },
  company: { type: String, default: '' },
  content: { type: String, default: '' },
  rating: { type: Number, default: 5 },
  avatar: { type: String, default: null }
});

const testimonialsSectionSchema = new mongoose.Schema({
  sectionTitle: {
    type: String,
    default: 'What Our Clients Say'
  },
  sectionDescription: {
    type: String,
    default: 'Don\'t just take our word for it. Here\'s what our clients have to say about working with us.'
  },
  testimonials: [testimonialSchema],
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TestimonialsSection', testimonialsSectionSchema);