const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  icon: { type: String, default: 'Code' },
  features: [{ type: String }],
  color: { type: String, default: 'from-blue-500 to-indigo-500' }
});

const servicesSectionSchema = new mongoose.Schema({
  sectionTitle: {
    type: String,
    default: 'Our Services'
  },
  sectionDescription: {
    type: String,
    default: 'Comprehensive solutions to help your business thrive in the digital landscape'
  },
  services: [serviceSchema],
  partnersTitle: {
    type: String,
    default: 'Trusted by Industry Leaders'
  },
  partnersList: {
    type: String,
    default: 'TechCorp, InnovateLab, DesignStudio, StartupHub, CreativeAgency, DataCorp'
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServicesSection', servicesSectionSchema);