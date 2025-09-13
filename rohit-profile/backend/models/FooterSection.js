const mongoose = require('mongoose');

const footerSectionSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: 'Portfolio'
  },
  tagline: {
    type: String,
    default: 'Building digital experiences that matter'
  },
  description: {
    type: String,
    default: 'Building digital experiences that bridge innovation and accessibility. Let\'s create something amazing together.'
  },
  email: {
    type: String,
    default: 'hello@portfolio.com'
  },
  phone: {
    type: String,
    default: '+1 (555) 123-4567'
  },
  address: {
    type: String,
    default: 'San Francisco, CA'
  },
  social: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
    github: { type: String, default: '' }
  },
  quickLinks: {
    type: [{
      name: { type: String, default: '' },
      url: { type: String, default: '' }
    }],
    default: [
      { name: 'Home', url: '#home' },
      { name: 'About', url: '#about' },
      { name: 'Services', url: '#services' },
      { name: 'Contact', url: '#contact' }
    ]
  },
  services: [{
    name: { type: String, default: '' },
    url: { type: String, default: '' }
  }],
  copyright: {
    type: String,
    default: '© 2024 Portfolio. Made with ❤️ All rights reserved.'
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FooterSection', footerSectionSchema);