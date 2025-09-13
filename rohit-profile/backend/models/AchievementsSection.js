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
  achievements: {
    type: [achievementSchema],
    default: [
      {
        year: '2024',
        title: 'Platform Expansion',
        description: 'Launched multi-platform content strategy reaching 500K+ users across YouTube, LinkedIn, and Instagram.',
        icon: 'Target',
        color: 'from-purple-500 to-violet-500'
      },
      {
        year: '2023',
        title: 'Award Recognition',
        description: 'Received "Digital Innovation Award" for outstanding contributions to the tech and content creation space.',
        icon: 'Award',
        color: 'from-yellow-500 to-orange-500'
      },
      {
        year: '2023',
        title: 'Team Growth',
        description: 'Expanded team to 15+ talented individuals across development, design, and marketing disciplines.',
        icon: 'Users',
        color: 'from-green-500 to-emerald-500'
      },
      {
        year: '2022',
        title: 'Major Milestone',
        description: 'Reached 100K YouTube subscribers and completed 50+ successful client projects.',
        icon: 'Zap',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        year: '2021',
        title: 'Business Launch',
        description: 'Officially launched consulting services, combining real estate expertise with digital solutions.',
        icon: 'MapPin',
        color: 'from-red-500 to-pink-500'
      },
      {
        year: '2019',
        title: 'Foundation',
        description: 'Started the journey with a vision to democratize access to high-quality digital solutions.',
        icon: 'Calendar',
        color: 'from-indigo-500 to-purple-500'
      }
    ]
  },
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