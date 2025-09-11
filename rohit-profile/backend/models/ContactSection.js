const mongoose = require('mongoose');

const contactSectionSchema = new mongoose.Schema({
  sectionTitle: {
    type: String,
    default: 'Get In Touch'
  },
  sectionDescription: {
    type: String,
    default: 'Ready to start your project? Have a question? We\'d love to hear from you. Let\'s create something amazing together.'
  },
  email: {
    type: String,
    default: 'hello@portfolio.com'
  },
  phone: {
    type: String,
    default: '+1 (555) 123-4567'
  },
  whatsapp: {
    type: String,
    default: '+1 (555) 123-4567'
  },
  location: {
    type: String,
    default: 'San Francisco, CA'
  },
  weekdays: {
    type: String,
    default: '8:00 AM - 6:00 PM'
  },
  saturday: {
    type: String,
    default: '9:00 AM - 4:00 PM'
  },
  sunday: {
    type: String,
    default: 'Closed'
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ContactSection', contactSectionSchema);