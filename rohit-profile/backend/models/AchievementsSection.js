const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  year: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  icon: { type: String, default: 'Award' },
  color: { type: String, default: 'from-blue-500 to-indigo-500' }
});

const achievementsSectionSchema = new mongoose.Schema({
  sectionTitle: {
    type: String,
    default: 'Our Journey'
  },
  sectionDescription: {
    type: String,
    default: 'Milestones and achievements that mark our path of continuous growth and innovation'
  },
  achievements: [achievementSchema],
  ctaTitle: {
    type: String,
    default: 'Be Part of Our Next Chapter'
  },
  ctaDescription: {
    type: String,
    default: 'Every milestone represents the trust our clients place in us. Let\'s create the next success story together.'
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AchievementsSection', achievementsSectionSchema);