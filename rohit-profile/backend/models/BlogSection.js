const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  excerpt: { type: String, default: '' },
  content: { type: String, default: '' },
  featuredImage: { type: String, default: null },
  author: { type: String, default: '' },
  publishedAt: { type: String, default: '' },
  readTime: { type: String, default: '5 min read' },
  category: { type: String, default: 'Technology' },
  thumbnail: { type: String, default: 'Post' },
  tags: [{ type: String }],
  slug: { type: String, default: '' }
});

const blogSectionSchema = new mongoose.Schema({
  sectionTitle: {
    type: String,
    default: 'Latest Articles'
  },
  sectionDescription: {
    type: String,
    default: 'Insights, tutorials, and thoughts on technology, business, and digital innovation'
  },
  posts: {
    type: [postSchema],
    default: [
      {
        title: 'The Future of Web Development: Trends to Watch in 2024',
        excerpt: 'Explore the latest trends shaping the web development landscape, from AI integration to serverless architecture and beyond.',
        author: 'John Doe',
        publishedAt: 'December 15, 2023',
        readTime: '8 min read',
        category: 'Technology',
        thumbnail: 'Web',
        tags: ['React', 'AI', 'Trends'],
        slug: 'future-web-development-2024'
      },
      {
        title: 'Real Estate Investment: A Beginner\'s Guide to Success',
        excerpt: 'Learn the fundamentals of real estate investing, from market analysis to financing options and risk management strategies.',
        author: 'David Kim',
        publishedAt: 'December 10, 2023',
        readTime: '12 min read',
        category: 'Real Estate',
        thumbnail: 'Real',
        tags: ['Investment', 'Strategy', 'Finance'],
        slug: 'real-estate-investment-guide'
      },
      {
        title: 'Building a Personal Brand Through Content Creation',
        excerpt: 'Discover how to leverage content creation to build a strong personal brand and grow your professional network.',
        author: 'Emily Rodriguez',
        publishedAt: 'December 5, 2023',
        readTime: '6 min read',
        category: 'Marketing',
        thumbnail: 'Brand',
        tags: ['Branding', 'Content', 'Growth'],
        slug: 'personal-brand-content-creation'
      },
      {
        title: 'Design Systems: Creating Consistency at Scale',
        excerpt: 'Learn how to build and maintain design systems that ensure consistency across large-scale applications and teams.',
        author: 'Michael Chen',
        publishedAt: 'November 28, 2023',
        readTime: '10 min read',
        category: 'Design',
        thumbnail: 'Design',
        tags: ['Design', 'Systems', 'UI/UX'],
        slug: 'design-systems-consistency-scale'
      },
      {
        title: 'The Psychology of User Experience: Understanding User Behavior',
        excerpt: 'Dive deep into user psychology and learn how to create experiences that truly resonate with your target audience.',
        author: 'Sarah Johnson',
        publishedAt: 'November 20, 2023',
        readTime: '9 min read',
        category: 'UX',
        thumbnail: 'UX',
        tags: ['Psychology', 'UX', 'Research'],
        slug: 'psychology-user-experience'
      },
      {
        title: 'Scaling Your Business: From Startup to Success',
        excerpt: 'Practical strategies and insights for scaling your business effectively while maintaining quality and culture.',
        author: 'Lisa Thompson',
        publishedAt: 'November 15, 2023',
        readTime: '11 min read',
        category: 'Business',
        thumbnail: 'Biz',
        tags: ['Business', 'Growth', 'Strategy'],
        slug: 'scaling-business-startup-success'
      }
    ]
  },
  categories: {
    type: [String],
    default: ['All', 'Technology', 'Real Estate', 'Marketing', 'Design', 'UX', 'Business']
  },
  newsletterTitle: {
    type: String,
    default: 'Stay Updated'
  },
  newsletterDescription: {
    type: String,
    default: 'Subscribe to our newsletter and get the latest articles, tutorials, and insights delivered directly to your inbox.'
  },
  newsletterButtonText: {
    type: String,
    default: 'Subscribe'
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BlogSection', blogSectionSchema);