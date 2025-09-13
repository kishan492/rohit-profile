const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  videoId: { type: String, default: '' },
  thumbnail: { type: String, default: 'Video' },
  views: { type: String, default: '0' },
  publishedAt: { type: String, default: '' }
});

const youtubeSectionSchema = new mongoose.Schema({
  sectionTitle: {
    type: String,
    default: 'YouTube Channel'
  },
  sectionDescription: {
    type: String,
    default: 'Educational content, tutorials, and insights to help you grow in technology and business'
  },
  channelName: {
    type: String,
    default: 'My Channel'
  },
  channelUrl: {
    type: String,
    default: 'https://youtube.com/@mychannel'
  },
  subscriberCount: {
    type: String,
    default: '125K+'
  },
  totalViews: {
    type: String,
    default: '2.5M+'
  },
  videos: {
    type: [videoSchema],
    default: [
      {
        title: 'Building a Modern React Portfolio',
        description: 'Learn how to create a stunning portfolio website using React and modern design principles.',
        videoId: 'dQw4w9WgXcQ',
        views: '45K',
        publishedAt: 'December 15, 2023',
        thumbnail: 'React'
      },
      {
        title: 'Real Estate Investment Strategies',
        description: 'Essential strategies for successful real estate investing in today\'s market.',
        videoId: 'dQw4w9WgXcQ',
        views: '32K',
        publishedAt: 'December 10, 2023',
        thumbnail: 'Real'
      },
      {
        title: 'Full Stack Development Guide',
        description: 'Complete guide to becoming a full-stack developer with practical examples.',
        videoId: 'dQw4w9WgXcQ',
        views: '67K',
        publishedAt: 'December 5, 2023',
        thumbnail: 'Full'
      }
    ]
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('YoutubeSection', youtubeSectionSchema);