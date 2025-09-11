const Section = require('../models/Section');

// @desc    Get all sections
// @route   GET /api/sections
// @access  Public
const getSections = async (req, res) => {
  try {
    const sections = await Section.find({ isVisible: true });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get section by type
// @route   GET /api/sections/:type
// @access  Public
const getSectionByType = async (req, res) => {
  try {
    const section = await Section.findOne({ 
      sectionType: req.params.type,
      isVisible: true 
    });
    
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update section
// @route   PUT /api/sections/:type
// @access  Private
const updateSection = async (req, res) => {
  try {
    const { content, isVisible } = req.body;
    
    let section = await Section.findOne({ sectionType: req.params.type });
    
    if (!section) {
      section = new Section({
        sectionType: req.params.type,
        content,
        isVisible: isVisible !== undefined ? isVisible : true
      });
    } else {
      section.content = content || section.content;
      section.isVisible = isVisible !== undefined ? isVisible : section.isVisible;
    }
    
    await section.save();
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle section visibility
// @route   PATCH /api/sections/:type/visibility
// @access  Private
const toggleSectionVisibility = async (req, res) => {
  try {
    const section = await Section.findOne({ sectionType: req.params.type });
    
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    section.isVisible = !section.isVisible;
    await section.save();
    
    res.json({ message: `Section ${section.isVisible ? 'enabled' : 'disabled'}`, section });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSections,
  getSectionByType,
  updateSection,
  toggleSectionVisibility
};