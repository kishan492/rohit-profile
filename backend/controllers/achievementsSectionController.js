const AchievementsSection = require('../models/AchievementsSection');

const getAchievementsSection = async (req, res) => {
  try {
    let achievementsSection = await AchievementsSection.findOne();
    
    if (!achievementsSection) {
      achievementsSection = new AchievementsSection();
      await achievementsSection.save();
    }
    
    res.json(achievementsSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAchievementsSection = async (req, res) => {
  try {
    const { sectionTitle, sectionDescription, achievements, ctaTitle, ctaDescription, isVisible } = req.body;
    
    let achievementsSection = await AchievementsSection.findOne();
    
    if (!achievementsSection) {
      achievementsSection = new AchievementsSection();
    }
    
    if (sectionTitle !== undefined) achievementsSection.sectionTitle = sectionTitle;
    if (sectionDescription !== undefined) achievementsSection.sectionDescription = sectionDescription;
    if (achievements !== undefined) achievementsSection.achievements = achievements;
    if (ctaTitle !== undefined) achievementsSection.ctaTitle = ctaTitle;
    if (ctaDescription !== undefined) achievementsSection.ctaDescription = ctaDescription;
    if (isVisible !== undefined) achievementsSection.isVisible = isVisible;
    
    await achievementsSection.save();
    res.json(achievementsSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleAchievementsVisibility = async (req, res) => {
  try {
    let achievementsSection = await AchievementsSection.findOne();
    
    if (!achievementsSection) {
      achievementsSection = new AchievementsSection();
    }
    
    achievementsSection.isVisible = !achievementsSection.isVisible;
    await achievementsSection.save();
    
    res.json({ 
      message: `Achievements section ${achievementsSection.isVisible ? 'enabled' : 'disabled'}`, 
      achievementsSection 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAchievementsSection,
  updateAchievementsSection,
  toggleAchievementsVisibility
};