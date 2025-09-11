const TestimonialsSection = require('../models/TestimonialsSection');

const getTestimonialsSection = async (req, res) => {
  try {
    let testimonialsSection = await TestimonialsSection.findOne();
    
    if (!testimonialsSection) {
      testimonialsSection = new TestimonialsSection();
      await testimonialsSection.save();
    }
    
    res.json(testimonialsSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTestimonialsSection = async (req, res) => {
  try {
    const { sectionTitle, sectionDescription, testimonials, isVisible } = req.body;
    
    let testimonialsSection = await TestimonialsSection.findOne();
    
    if (!testimonialsSection) {
      testimonialsSection = new TestimonialsSection();
    }
    
    if (sectionTitle !== undefined) testimonialsSection.sectionTitle = sectionTitle;
    if (sectionDescription !== undefined) testimonialsSection.sectionDescription = sectionDescription;
    if (testimonials !== undefined) testimonialsSection.testimonials = testimonials;
    if (isVisible !== undefined) testimonialsSection.isVisible = isVisible;
    
    await testimonialsSection.save();
    res.json(testimonialsSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleTestimonialsVisibility = async (req, res) => {
  try {
    let testimonialsSection = await TestimonialsSection.findOne();
    
    if (!testimonialsSection) {
      testimonialsSection = new TestimonialsSection();
    }
    
    testimonialsSection.isVisible = !testimonialsSection.isVisible;
    await testimonialsSection.save();
    
    res.json({ 
      message: `Testimonials section ${testimonialsSection.isVisible ? 'enabled' : 'disabled'}`, 
      testimonialsSection 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTestimonialsSection,
  updateTestimonialsSection,
  toggleTestimonialsVisibility
};