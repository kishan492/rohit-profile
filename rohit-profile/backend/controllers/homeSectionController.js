const HomeSection = require('../models/HomeSection');

// @desc    Get home section data
// @route   GET /api/home
// @access  Public
const getHomeSection = async (req, res) => {
  try {
    let homeSection = await HomeSection.findOne();
    
    // If no home section exists, create one with default data
    if (!homeSection) {
      homeSection = new HomeSection();
      await homeSection.save();
    }
    
    res.json(homeSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update home section data
// @route   PUT /api/home
// @access  Private
const updateHomeSection = async (req, res) => {
  try {
    console.log('Received update request:', req.body);
  const { name, title, headline, subtitle, profileImage, isVisible } = req.body;
    
    let homeSection = await HomeSection.findOne();
    
    if (!homeSection) {
      homeSection = new HomeSection();
    }
    
    // Update fields if provided
    if (name !== undefined && name !== '') homeSection.name = name;
    if (title !== undefined && title !== '') homeSection.title = title;
    if (headline !== undefined && headline !== '') homeSection.headline = headline;
    if (subtitle !== undefined && subtitle !== '') homeSection.subtitle = subtitle;
    if (profileImage !== undefined) homeSection.profileImage = profileImage;
  // stats removed
    if (isVisible !== undefined) homeSection.isVisible = isVisible;
    
    await homeSection.save();
    console.log('Saved homeSection:', homeSection);
    res.json(homeSection);
  } catch (error) {
    console.error('Error updating home section:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle home section visibility
// @route   PATCH /api/home/visibility
// @access  Private
const toggleHomeVisibility = async (req, res) => {
  try {
    let homeSection = await HomeSection.findOne();
    
    if (!homeSection) {
      homeSection = new HomeSection();
    }
    
    homeSection.isVisible = !homeSection.isVisible;
    await homeSection.save();
    
    res.json({ 
      message: `Home section ${homeSection.isVisible ? 'enabled' : 'disabled'}`, 
      homeSection 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset home section to defaults
// @route   POST /api/home/reset
// @access  Private
const resetHomeSection = async (req, res) => {
  try {
    await HomeSection.deleteMany({});
    const homeSection = new HomeSection();
    await homeSection.save();
    
    res.json({ message: 'Home section reset to defaults', homeSection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHomeSection,
  updateHomeSection,
  toggleHomeVisibility,
  resetHomeSection
};