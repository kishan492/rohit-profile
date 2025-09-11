const BlogSection = require('../models/BlogSection');

const getBlogSection = async (req, res) => {
  try {
    let blogSection = await BlogSection.findOne();
    if (!blogSection) {
      blogSection = new BlogSection();
      await blogSection.save();
    }
    res.json(blogSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBlogSection = async (req, res) => {
  try {
    const { sectionTitle, sectionDescription, posts, isVisible } = req.body;
    let blogSection = await BlogSection.findOne();
    if (!blogSection) blogSection = new BlogSection();
    
    if (sectionTitle !== undefined) blogSection.sectionTitle = sectionTitle;
    if (sectionDescription !== undefined) blogSection.sectionDescription = sectionDescription;
    if (posts !== undefined) blogSection.posts = posts;
    if (isVisible !== undefined) blogSection.isVisible = isVisible;
    
    await blogSection.save();
    res.json(blogSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleBlogVisibility = async (req, res) => {
  try {
    let blogSection = await BlogSection.findOne();
    if (!blogSection) blogSection = new BlogSection();
    blogSection.isVisible = !blogSection.isVisible;
    await blogSection.save();
    res.json({ message: `Blog section ${blogSection.isVisible ? 'enabled' : 'disabled'}`, blogSection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBlogSection, updateBlogSection, toggleBlogVisibility };