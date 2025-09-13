const AchievementsSection = require('../models/AchievementsSection');

// @desc    Get achievements section data
// @route   GET /api/achievements
// @access  Public
const getAchievementsSection = async (req, res) => {
  try {
    let achievementsSection = await AchievementsSection.findOne();
    
    // If no achievements section exists, create one with default data
    if (!achievementsSection) {
      achievementsSection = new AchievementsSection({
        achievements: [
          {
            year: '2024',
            title: 'Platform Expansion',
            description: 'Launched multi-platform content strategy reaching 500K+ users across YouTube, LinkedIn, and Instagram.',
            icon: 'Target',
            color: 'from-purple-500 to-violet-500'
          },
          {
            year: '2023',
            title: 'Award Recognition',
            description: 'Received "Digital Innovation Award" for outstanding contributions to the tech and content creation space.',
            icon: 'Award',
            color: 'from-yellow-500 to-orange-500'
          },
          {
            year: '2023',
            title: 'Team Growth',
            description: 'Expanded team to 15+ talented individuals across development, design, and marketing disciplines.',
            icon: 'Users',
            color: 'from-green-500 to-emerald-500'
          },
          {
            year: '2022',
            title: 'Major Milestone',
            description: 'Reached 100K YouTube subscribers and completed 50+ successful client projects.',
            icon: 'Zap',
            color: 'from-blue-500 to-cyan-500'
          },
          {
            year: '2021',
            title: 'Business Launch',
            description: 'Officially launched consulting services, combining real estate expertise with digital solutions.',
            icon: 'MapPin',
            color: 'from-red-500 to-pink-500'
          },
          {
            year: '2019',
            title: 'Foundation',
            description: 'Started the journey with a vision to democratize access to high-quality digital solutions.',
            icon: 'Calendar',
            color: 'from-indigo-500 to-purple-500'
          }
        ]
      });
      await achievementsSection.save();
    }
    
    res.json(achievementsSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update achievements section data
// @route   PUT /api/achievements
// @access  Private
const updateAchievementsSection = async (req, res) => {
  try {
    console.log('Received achievements update:', req.body);
    const { sectionTitle, sectionDescription, achievements, ctaTitle, ctaDescription, isVisible } = req.body;
    
    let achievementsSection = await AchievementsSection.findOne();
    
    if (!achievementsSection) {
      achievementsSection = new AchievementsSection();
    }
    
    // Update fields if provided
    if (sectionTitle !== undefined && sectionTitle !== '') achievementsSection.sectionTitle = sectionTitle;
    if (sectionDescription !== undefined && sectionDescription !== '') achievementsSection.sectionDescription = sectionDescription;
    if (achievements !== undefined) achievementsSection.achievements = achievements;
    if (ctaTitle !== undefined && ctaTitle !== '') achievementsSection.ctaTitle = ctaTitle;
    if (ctaDescription !== undefined && ctaDescription !== '') achievementsSection.ctaDescription = ctaDescription;
    if (isVisible !== undefined) achievementsSection.isVisible = isVisible;
    
    await achievementsSection.save();
    console.log('Saved achievementsSection:', achievementsSection);
    res.json(achievementsSection);
  } catch (error) {
    console.error('Error updating achievements section:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle achievements section visibility
// @route   PATCH /api/achievements/visibility
// @access  Private
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

// @desc    Reset achievements section to defaults
// @route   POST /api/achievements/reset
// @access  Private
const resetAchievementsSection = async (req, res) => {
  try {
    await AchievementsSection.deleteMany({});
    const achievementsSection = new AchievementsSection();
    await achievementsSection.save();
    
    res.json({ message: 'Achievements section reset to defaults', achievementsSection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAchievementsSection,
  updateAchievementsSection,
  toggleAchievementsVisibility,
  resetAchievementsSection
};