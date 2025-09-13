const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  role: { type: String, default: '' },
  location: { type: String, default: '' },
  bio: { type: String, default: '' },
  initials: { type: String, default: '' },
  skills: [{ type: String }],
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
    default: 'Talented individuals from diverse backgrounds working together to create exceptional digital experiences'
  },
  members: {
    type: [memberSchema],
    default: [
      {
        name: 'John Doe',
        role: 'Founder & CEO',
        location: 'San Francisco, CA',
        bio: 'Visionary leader with 10+ years in tech and business development. Passionate about building digital solutions that make a difference.',
        initials: 'JD',
        skills: ['Strategy', 'Leadership', 'Product Vision'],
        social: { linkedin: '#', twitter: '#', github: '#', email: '' }
      },
      {
        name: 'Sarah Johnson',
        role: 'Lead Developer',
        location: 'Seattle, WA',
        bio: 'Full-stack developer specializing in React, Node.js, and cloud architecture. Loves creating scalable and performant applications.',
        initials: 'SJ',
        skills: ['React', 'Node.js', 'AWS'],
        social: { linkedin: '#', twitter: '#', github: '#', email: '' }
      },
      {
        name: 'Michael Chen',
        role: 'UI/UX Designer',
        location: 'New York, NY',
        bio: 'Creative designer focused on user experience and modern interfaces. Believes great design should be both beautiful and functional.',
        initials: 'MC',
        skills: ['Design', 'Figma', 'Prototyping'],
        social: { linkedin: '#', twitter: '#', github: '#', email: '' }
      },
      {
        name: 'Emily Rodriguez',
        role: 'Content Creator',
        location: 'Austin, TX',
        bio: 'Content strategist and video producer. Specializes in educational content and brand storytelling across digital platforms.',
        initials: 'ER',
        skills: ['Video', 'Writing', 'Strategy'],
        social: { linkedin: '#', twitter: '#', github: '#', email: '' }
      },
      {
        name: 'David Kim',
        role: 'Real Estate Consultant',
        location: 'Los Angeles, CA',
        bio: 'Real estate expert with deep market knowledge and investment strategies. Helps clients make informed property decisions.',
        initials: 'DK',
        skills: ['Real Estate', 'Investment', 'Analysis'],
        social: { linkedin: '#', twitter: '#', github: '#', email: '' }
      },
      {
        name: 'Lisa Thompson',
        role: 'Marketing Director',
        location: 'Chicago, IL',
        bio: 'Digital marketing specialist driving growth through data-driven strategies and creative campaigns across multiple channels.',
        initials: 'LT',
        skills: ['Marketing', 'Analytics', 'Growth'],
        social: { linkedin: '#', twitter: '#', github: '#', email: '' }
      }
    ]
  },
  ctaTitle: {
    type: String,
    default: 'Want to Join Our Team?'
  },
  ctaDescription: {
    type: String,
    default: "We're always looking for talented individuals who share our passion for innovation and excellence. Let's build something amazing together."
  },
  ctaButtonText: {
    type: String,
    default: 'View Open Positions'
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TeamSection', teamSectionSchema);