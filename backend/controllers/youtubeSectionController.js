const YoutubeSection = require('../models/YoutubeSection');

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

const updateYoutubeSection = async (req, res) => {
  try {
    const { sectionTitle, sectionDescription, channelName, channelUrl, subscriberCount, totalViews, videos, isVisible } = req.body;
    
    let youtubeSection = await YoutubeSection.findOne();
    
    if (!youtubeSection) {
      youtubeSection = new YoutubeSection();
    }
    
    if (sectionTitle !== undefined) youtubeSection.sectionTitle = sectionTitle;
    if (sectionDescription !== undefined) youtubeSection.sectionDescription = sectionDescription;
    if (channelName !== undefined) youtubeSection.channelName = channelName;
    if (channelUrl !== undefined) youtubeSection.channelUrl = channelUrl;
    if (subscriberCount !== undefined) youtubeSection.subscriberCount = subscriberCount;
    if (totalViews !== undefined) youtubeSection.totalViews = totalViews;
    if (videos !== undefined) youtubeSection.videos = videos;
    if (isVisible !== undefined) youtubeSection.isVisible = isVisible;
    
    await youtubeSection.save();
    res.json(youtubeSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

module.exports = {
  getYoutubeSection,
  updateYoutubeSection,
  toggleYoutubeVisibility
};