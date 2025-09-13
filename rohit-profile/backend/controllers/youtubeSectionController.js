const YoutubeSection = require('../models/YoutubeSection');

// @desc    Get youtube section data
// @route   GET /api/youtube
// @access  Public
const getYoutubeSection = async (req, res) => {
  try {
    let youtubeSection = await YoutubeSection.findOne();
    
    if (!youtubeSection) {
      youtubeSection = new YoutubeSection();
      await youtubeSection.save();
    }
    
    res.json(youtubeSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update youtube section data
// @route   PUT /api/youtube
// @access  Private
const updateYoutubeSection = async (req, res) => {
  try {
    console.log('Received youtube update:', req.body);
    const { sectionTitle, sectionDescription, channelName, channelUrl, subscriberCount, totalViews, videos, isVisible } = req.body;
    
    let youtubeSection = await YoutubeSection.findOne();
    
    if (!youtubeSection) {
      youtubeSection = new YoutubeSection();
    }
    
    if (sectionTitle !== undefined && sectionTitle !== '') youtubeSection.sectionTitle = sectionTitle;
    if (sectionDescription !== undefined && sectionDescription !== '') youtubeSection.sectionDescription = sectionDescription;
    if (channelName !== undefined && channelName !== '') youtubeSection.channelName = channelName;
    if (channelUrl !== undefined && channelUrl !== '') youtubeSection.channelUrl = channelUrl;
    if (subscriberCount !== undefined && subscriberCount !== '') youtubeSection.subscriberCount = subscriberCount;
    if (totalViews !== undefined && totalViews !== '') youtubeSection.totalViews = totalViews;
    if (videos !== undefined) youtubeSection.videos = videos;
    if (isVisible !== undefined) youtubeSection.isVisible = isVisible;
    
    await youtubeSection.save();
    console.log('Saved youtubeSection:', youtubeSection);
    res.json(youtubeSection);
  } catch (error) {
    console.error('Error updating youtube section:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle youtube section visibility
// @route   PATCH /api/youtube/visibility
// @access  Private
const toggleYoutubeVisibility = async (req, res) => {
  try {
    let youtubeSection = await YoutubeSection.findOne();
    
    if (!youtubeSection) {
      youtubeSection = new YoutubeSection();
    }
    
    youtubeSection.isVisible = !youtubeSection.isVisible;
    await youtubeSection.save();
    
    res.json({ 
      message: `YouTube section ${youtubeSection.isVisible ? 'enabled' : 'disabled'}`, 
      youtubeSection 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset youtube section to defaults
// @route   POST /api/youtube/reset
// @access  Private
const resetYoutubeSection = async (req, res) => {
  try {
    await YoutubeSection.deleteMany({});
    const youtubeSection = new YoutubeSection();
    await youtubeSection.save();
    
    res.json({ message: 'YouTube section reset to defaults', youtubeSection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getYoutubeSection,
  updateYoutubeSection,
  toggleYoutubeVisibility,
  resetYoutubeSection
};