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
    default: 'We create innovative digital solutions that help businesses thrive in the modern world.'
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
  quickLinks: [{
    name: { type: String, default: '' },
    url: { type: String, default: '' }
  }],
  services: [{
    name: { type: String, default: '' },
    url: { type: String, default: '' }
  }],
  copyright: {
    type: String,
    default: '© 2024 Portfolio. All rights reserved.'
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FooterSection', footerSectionSchema);