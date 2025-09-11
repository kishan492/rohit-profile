const FooterSection = require('../models/FooterSection');

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

const updateFooterSection = async (req, res) => {
  try {
    const { companyName, tagline, description, email, phone, address, social, quickLinks, services, copyright, isVisible } = req.body;
    let footerSection = await FooterSection.findOne();
    if (!footerSection) footerSection = new FooterSection();
    
    if (companyName !== undefined) footerSection.companyName = companyName;
    if (tagline !== undefined) footerSection.tagline = tagline;
    if (description !== undefined) footerSection.description = description;
    if (email !== undefined) footerSection.email = email;
    if (phone !== undefined) footerSection.phone = phone;
    if (address !== undefined) footerSection.address = address;
    if (social !== undefined) footerSection.social = { ...footerSection.social, ...social };
    if (quickLinks !== undefined) footerSection.quickLinks = quickLinks;
    if (services !== undefined) footerSection.services = services;
    if (copyright !== undefined) footerSection.copyright = copyright;
    if (isVisible !== undefined) footerSection.isVisible = isVisible;
    
    await footerSection.save();
    res.json(footerSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

module.exports = { getFooterSection, updateFooterSection, toggleFooterVisibility };