const BlogSection = require('../models/BlogSection');

// @desc    Get blog section data
// @route   GET /api/blog
// @access  Public
const getBlogSection = async (req, res) => {
  try {
    let blogSection = await BlogSection.findOne();
    
    // If no blog section exists, create one with default data
    if (!blogSection) {
      blogSection = new BlogSection();
      await blogSection.save();
    }
    
    res.json(blogSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update blog section data
// @route   PUT /api/blog
// @access  Private
const updateBlogSection = async (req, res) => {
  try {
    console.log('Received blog update:', req.body);
    const { sectionTitle, sectionDescription, posts, categories, newsletterTitle, newsletterDescription, newsletterButtonText, isVisible } = req.body;
    
    let blogSection = await BlogSection.findOne();
    
    if (!blogSection) {
      blogSection = new BlogSection();
    }
    
    // Update fields if provided
    if (sectionTitle !== undefined && sectionTitle !== '') blogSection.sectionTitle = sectionTitle;
    if (sectionDescription !== undefined && sectionDescription !== '') blogSection.sectionDescription = sectionDescription;
    if (posts !== undefined) blogSection.posts = posts;
    if (categories !== undefined) blogSection.categories = typeof categories === 'string' ? categories.split(',').map(c => c.trim()) : categories;
    if (newsletterTitle !== undefined && newsletterTitle !== '') blogSection.newsletterTitle = newsletterTitle;
    if (newsletterDescription !== undefined && newsletterDescription !== '') blogSection.newsletterDescription = newsletterDescription;
    if (newsletterButtonText !== undefined && newsletterButtonText !== '') blogSection.newsletterButtonText = newsletterButtonText;
    if (isVisible !== undefined) blogSection.isVisible = isVisible;
    
    await blogSection.save();
    console.log('Saved blogSection:', blogSection);
    res.json(blogSection);
  } catch (error) {
    console.error('Error updating blog section:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle blog section visibility
// @route   PATCH /api/blog/visibility
// @access  Private
const toggleBlogVisibility = async (req, res) => {
  try {
    let blogSection = await BlogSection.findOne();
    
    if (!blogSection) {
      blogSection = new BlogSection();
    }
    
    blogSection.isVisible = !blogSection.isVisible;
    await blogSection.save();
    
    res.json({ 
      message: `Blog section ${blogSection.isVisible ? 'enabled' : 'disabled'}`, 
      blogSection 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset blog section to defaults
// @route   POST /api/blog/reset
// @access  Private
const resetBlogSection = async (req, res) => {
  try {
    await BlogSection.deleteMany({});
    const blogSection = new BlogSection();
    await blogSection.save();
    
    res.json({ message: 'Blog section reset to defaults', blogSection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBlogSection,
  updateBlogSection,
  toggleBlogVisibility,
  resetBlogSection
};