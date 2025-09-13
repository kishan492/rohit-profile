const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  sectionVisibility: {
    hero: { type: Boolean, default: true },
    about: { type: Boolean, default: true },
    services: { type: Boolean, default: true },
    testimonials: { type: Boolean, default: true },
    achievements: { type: Boolean, default: true },
    youtube: { type: Boolean, default: true },
    team: { type: Boolean, default: true },
    blog: { type: Boolean, default: true },
    contact: { type: Boolean, default: true }
  },
  siteInfo: {
    siteTitle: { type: String, default: 'Portfolio' },
    siteTagline: { type: String, default: 'Professional Portfolio Website' },
    siteDescription: { type: String, default: 'A professional portfolio showcasing skills, services, and achievements in technology and business.' },
    siteUrl: { type: String, default: 'https://yourportfolio.com' },
    adminEmail: { type: String, default: 'admin@yourportfolio.com' }
  },
  seoSettings: {
    metaKeywords: { type: String, default: 'portfolio, web development, design, consulting' },
    metaDescription: { type: String, default: 'Professional portfolio website showcasing expertise in web development, design, and digital consulting services.' },
    googleAnalyticsId: { type: String, default: '' },
    googleSearchConsole: { type: String, default: '' }
  },
  performanceSettings: {
    enableAnimations: { type: Boolean, default: true },
    lazyLoadImages: { type: Boolean, default: true },
    enableCaching: { type: Boolean, default: true }
  },
  maintenanceSettings: {
    enableMaintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: "We're currently updating our website. Please check back soon!" }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);