const mongoose = require('mongoose');

const aboutSectionSchema = new mongoose.Schema({
  sectionTitle: {
    type: String,
    default: 'About Our Story'
  },
  sectionSubtitle: {
    type: String,
    default: 'Building digital experiences that bridge innovation and accessibility'
  },
  mainTitle: {
    type: String,
    default: 'Crafting Digital Excellence Since 2019'
  },
  description1: {
    type: String,
    default: 'What started as a passion project has evolved into a comprehensive digital agency.'
  },
  description2: {
    type: String,
    default: 'Our mission is to democratize access to high-quality digital solutions.'
  },
  aboutImage: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: 'San Francisco'
  },
  founded: {
    type: String,
    default: '2019'
  },
  teamSize: {
    type: String,
    default: '15+'
  },
  awards: {
    type: String,
    default: '8'
  },
  mission: {
    type: String,
    default: 'To empower businesses with cutting-edge digital solutions'
  },
  values: {
    type: String,
    default: 'Innovation through collaboration\nQuality over quantity\nTransparency in every interaction'
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AboutSection', aboutSectionSchema);