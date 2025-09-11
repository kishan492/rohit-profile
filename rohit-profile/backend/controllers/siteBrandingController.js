const SiteBranding = require('../models/SiteBranding');

// @desc    Get site branding data
// @route   GET /api/branding
// @access  Public
const getSiteBranding = async (req, res) => {
  try {
    let branding = await SiteBranding.findOne();
    
    if (!branding) {
      branding = new SiteBranding();
      await branding.save();
    }
    
    res.json(branding);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update site branding data
// @route   PUT /api/branding
// @access  Private
const updateSiteBranding = async (req, res) => {
  try {
    console.log('Received branding update:', req.body);
    const { siteName, logoText, logoImage, favicon, browserTitle, metaDescription } = req.body;
    
    let branding = await SiteBranding.findOne();
    
    if (!branding) {
      branding = new SiteBranding();
    }
    
    if (siteName !== undefined) branding.siteName = siteName;
    if (logoText !== undefined) branding.logoText = logoText;
    if (logoImage !== undefined) branding.logoImage = logoImage;
    if (favicon !== undefined) branding.favicon = favicon;
    if (browserTitle !== undefined) branding.browserTitle = browserTitle;
    if (metaDescription !== undefined) branding.metaDescription = metaDescription;
    
    await branding.save();
    console.log('Saved branding:', branding);
    res.json(branding);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSiteBranding,
  updateSiteBranding
};