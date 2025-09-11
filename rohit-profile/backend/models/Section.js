const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  sectionType: {
    type: String,
    required: true,
    enum: ['hero', 'about', 'services', 'achievements', 'team', 'youtube', 'blog', 'contact', 'footer']
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Section', sectionSchema);