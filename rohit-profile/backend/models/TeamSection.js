const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  role: { type: String, default: '' },
  bio: { type: String, default: '' },
  avatar: { type: String, default: null },
  social: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    github: { type: String, default: '' },
    email: { type: String, default: '' }
  }
});

const teamSectionSchema = new mongoose.Schema({
  sectionTitle: {
    type: String,
    default: 'Meet Our Team'
  },
  sectionDescription: {
    type: String,
    default: 'The talented individuals behind our success. Each team member brings unique expertise and passion to every project.'
  },
  members: [memberSchema],
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TeamSection', teamSectionSchema);