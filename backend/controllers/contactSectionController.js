const ContactSection = require('../models/ContactSection');

const getContactSection = async (req, res) => {
  try {
    let contactSection = await ContactSection.findOne();
    
    if (!contactSection) {
      contactSection = new ContactSection();
      await contactSection.save();
    }
    
    res.json(contactSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateContactSection = async (req, res) => {
  try {
    const { sectionTitle, sectionDescription, email, phone, whatsapp, location, weekdays, saturday, sunday, isVisible } = req.body;
    
    let contactSection = await ContactSection.findOne();
    
    if (!contactSection) {
      contactSection = new ContactSection();
    }
    
    if (sectionTitle !== undefined) contactSection.sectionTitle = sectionTitle;
    if (sectionDescription !== undefined) contactSection.sectionDescription = sectionDescription;
    if (email !== undefined) contactSection.email = email;
    if (phone !== undefined) contactSection.phone = phone;
    if (whatsapp !== undefined) contactSection.whatsapp = whatsapp;
    if (location !== undefined) contactSection.location = location;
    if (weekdays !== undefined) contactSection.weekdays = weekdays;
    if (saturday !== undefined) contactSection.saturday = saturday;
    if (sunday !== undefined) contactSection.sunday = sunday;
    if (isVisible !== undefined) contactSection.isVisible = isVisible;
    
    await contactSection.save();
    res.json(contactSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleContactVisibility = async (req, res) => {
  try {
    let contactSection = await ContactSection.findOne();
    
    if (!contactSection) {
      contactSection = new ContactSection();
    }
    
    contactSection.isVisible = !contactSection.isVisible;
    await contactSection.save();
    
    res.json({ 
      message: `Contact section ${contactSection.isVisible ? 'enabled' : 'disabled'}`, 
      contactSection 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getContactSection,
  updateContactSection,
  toggleContactVisibility
};