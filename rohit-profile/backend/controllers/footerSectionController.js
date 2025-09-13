const FooterSection = require('../models/FooterSection');

// @desc    Get footer section data
// @route   GET /api/footer
// @access  Public
const getFooterSection = async (req, res) => {
  try {
    let footerSection = await FooterSection.findOne();
    if (!footerSection) {
      footerSection = new FooterSection();
      await footerSection.save();
    }
    res.json(footerSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update footer section data
// @route   PUT /api/footer
// @access  Private
const updateFooterSection = async (req, res) => {
  try {
    console.log('Received footer update:', req.body);
    const { companyName, tagline, description, email, phone, address, social, quickLinks, services, copyright, isVisible } = req.body;
    
    let footerSection = await FooterSection.findOne();
    if (!footerSection) footerSection = new FooterSection();
    
    if (companyName !== undefined && companyName !== '') footerSection.companyName = companyName;
    if (tagline !== undefined && tagline !== '') footerSection.tagline = tagline;
    if (description !== undefined && description !== '') footerSection.description = description;
    if (email !== undefined && email !== '') footerSection.email = email;
    if (phone !== undefined && phone !== '') footerSection.phone = phone;
    if (address !== undefined && address !== '') footerSection.address = address;
    if (social !== undefined) footerSection.social = { ...footerSection.social, ...social };
    if (quickLinks !== undefined) footerSection.quickLinks = quickLinks;
    if (services !== undefined) footerSection.services = services;
    if (copyright !== undefined && copyright !== '') footerSection.copyright = copyright;
    if (isVisible !== undefined) footerSection.isVisible = isVisible;
    
    await footerSection.save();
    console.log('Saved footerSection:', footerSection);
    res.json(footerSection);
  } catch (error) {
    console.error('Error updating footer section:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle footer section visibility
// @route   PATCH /api/footer/visibility
// @access  Private
const toggleFooterVisibility = async (req, res) => {
  try {
    let footerSection = await FooterSection.findOne();
    if (!footerSection) footerSection = new FooterSection();
    footerSection.isVisible = !footerSection.isVisible;
    await footerSection.save();
    res.json({ message: `Footer section ${footerSection.isVisible ? 'enabled' : 'disabled'}`, footerSection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset footer section to defaults
// @route   POST /api/footer/reset
// @access  Private
const resetFooterSection = async (req, res) => {
  try {
    await FooterSection.deleteMany({});
    const footerSection = new FooterSection();
    await footerSection.save();
    res.json({ message: 'Footer section reset to defaults', footerSection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFooterSection,
  updateFooterSection,
  toggleFooterVisibility,
  resetFooterSection
};