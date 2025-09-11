const mongoose = require('mongoose');

const siteBrandingSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
    default: 'Portfolio'
  },
  logoText: {
    type: String,
    required: true,
    default: 'Portfolio'
  },
  logoImage: {
    type: String,
    default: null
  },
  favicon: {
    type: String,
    default: null
  },
  browserTitle: {
    type: String,
    required: true,
    default: 'Portfolio - Professional Website'
  },
  metaDescription: {
    type: String,
    default: 'Professional portfolio website showcasing projects and services'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SiteBranding', siteBrandingSchema);