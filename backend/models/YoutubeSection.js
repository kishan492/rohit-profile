const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  videoId: { type: String, default: '' },
  thumbnail: { type: String, default: null },
  views: { type: String, default: '0' },
  publishedAt: { type: String, default: '' }
});

const youtubeSectionSchema = new mongoose.Schema({
  sectionTitle: {
    type: String,
    default: 'Latest YouTube Videos'
  },
  sectionDescription: {
    type: String,
    default: 'Check out our latest content covering tech tutorials, industry insights, and behind-the-scenes content.'
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
    default: '100K+'
  },
  totalViews: {
    type: String,
    default: '1M+'
  },
  videos: [videoSchema],
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('YoutubeSection', youtubeSectionSchema);