const AboutSection = require('../models/AboutSection');

// @desc    Get about section data
// @route   GET /api/about
// @access  Public
const getAboutSection = async (req, res) => {
  try {
    let aboutSection = await AboutSection.findOne();
    
    if (!aboutSection) {
      aboutSection = new AboutSection();
      await aboutSection.save();
    }
    
    res.json(aboutSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update about section data
// @route   PUT /api/about
// @access  Private
const updateAboutSection = async (req, res) => {
  try {
    console.log('Received about update:', req.body);
    const { 
      sectionTitle, sectionSubtitle, mainTitle, description1, description2, 
      aboutImage, location, founded, teamSize, awards, mission, values, isVisible 
    } = req.body;
    
    let aboutSection = await AboutSection.findOne();
    
    if (!aboutSection) {
      aboutSection = new AboutSection();
    }
    
    if (sectionTitle !== undefined) aboutSection.sectionTitle = sectionTitle;
    if (sectionSubtitle !== undefined) aboutSection.sectionSubtitle = sectionSubtitle;
    if (mainTitle !== undefined) aboutSection.mainTitle = mainTitle;
    if (description1 !== undefined) aboutSection.description1 = description1;
    if (description2 !== undefined) aboutSection.description2 = description2;
    if (aboutImage !== undefined) aboutSection.aboutImage = aboutImage;
    if (location !== undefined) aboutSection.location = location;
    if (founded !== undefined) aboutSection.founded = founded;
    if (teamSize !== undefined) aboutSection.teamSize = teamSize;
    if (awards !== undefined) aboutSection.awards = awards;
    if (mission !== undefined) aboutSection.mission = mission;
    if (values !== undefined) aboutSection.values = values;
    if (isVisible !== undefined) aboutSection.isVisible = isVisible;
    
    await aboutSection.save();
    console.log('Saved aboutSection:', aboutSection);
    res.json(aboutSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle about section visibility
// @route   PATCH /api/about/visibility
// @access  Private
const toggleAboutVisibility = async (req, res) => {
  try {
    let aboutSection = await AboutSection.findOne();
    
    if (!aboutSection) {
      aboutSection = new AboutSection();
    }
    
    aboutSection.isVisible = !aboutSection.isVisible;
    await aboutSection.save();
    
    res.json({ 
      message: `About section ${aboutSection.isVisible ? 'enabled' : 'disabled'}`, 
      aboutSection 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAboutSection,
  updateAboutSection,
  toggleAboutVisibility
};