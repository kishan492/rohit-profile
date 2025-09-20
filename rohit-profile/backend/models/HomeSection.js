const mongoose = require('mongoose');

const homeSectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'John Doe'
  },
  title: {
    type: String,
    required: true,
    default: 'Entrepreneur & Developer'
  },
  headline: {
    type: String,
    required: true,
    default: 'Innovating the Future One Project at a Time'
  },
  subtitle: {
    type: String,
    required: true,
    default: 'Entrepreneur, Content Creator & Developer building digital experiences that matter.'
  },
  profileImage: {
    type: String,
    default: null
  },
  // stats removed
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HomeSection', homeSectionSchema);