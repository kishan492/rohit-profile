const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  excerpt: { type: String, default: '' },
  content: { type: String, default: '' },
  featuredImage: { type: String, default: null },
  author: { type: String, default: '' },
  publishedAt: { type: String, default: '' },
  tags: [{ type: String }],
  slug: { type: String, default: '' }
});

const blogSectionSchema = new mongoose.Schema({
  sectionTitle: {
    type: String,
    default: 'Latest Blog Posts'
  },
  sectionDescription: {
    type: String,
    default: 'Insights, tutorials, and thoughts on technology, business, and innovation.'
  },
  posts: [postSchema],
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BlogSection', blogSectionSchema);