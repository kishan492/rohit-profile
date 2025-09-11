const ServicesSection = require('../models/ServicesSection');

// @desc    Get services section data
// @route   GET /api/services
// @access  Public
const getServicesSection = async (req, res) => {
  try {
    let servicesSection = await ServicesSection.findOne();
    
    if (!servicesSection) {
      servicesSection = new ServicesSection({
        services: [
          {
            title: 'Content Creation',
            description: 'Engaging video content, tutorials, and educational materials for YouTube and social media platforms.',
            icon: 'Video',
            features: ['Video Production', 'Script Writing', 'Post-Production', 'Channel Strategy'],
            color: 'from-red-500 to-pink-500'
          },
          {
            title: 'Real Estate Consulting',
            description: 'Strategic consulting for real estate investments, market analysis, and property development guidance.',
            icon: 'Home',
            features: ['Market Analysis', 'Investment Strategy', 'Property Valuation', 'Deal Structuring'],
            color: 'from-green-500 to-emerald-500'
          },
          {
            title: 'Website Development',
            description: 'Custom web applications, e-commerce solutions, and responsive websites built with modern technologies.',
            icon: 'Code',
            features: ['React Development', 'E-commerce Solutions', 'API Integration', 'Performance Optimization'],
            color: 'from-blue-500 to-indigo-500'
          },
          {
            title: 'Mobile App Development',
            description: 'Native and cross-platform mobile applications designed for optimal user experience.',
            icon: 'Smartphone',
            features: ['iOS Development', 'Android Development', 'React Native', 'App Store Optimization'],
            color: 'from-purple-500 to-violet-500'
          },
          {
            title: 'UI/UX Design',
            description: 'User-centered design solutions that enhance engagement and drive conversions.',
            icon: 'Palette',
            features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
            color: 'from-orange-500 to-amber-500'
          },
          {
            title: 'Digital Marketing',
            description: 'Data-driven marketing strategies to grow your online presence and reach your target audience.',
            icon: 'BarChart',
            features: ['SEO Strategy', 'Social Media Marketing', 'Content Marketing', 'Analytics'],
            color: 'from-teal-500 to-cyan-500'
          }
        ]
      });
      await servicesSection.save();
    }
    
    res.json(servicesSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update services section data
// @route   PUT /api/services
// @access  Private
const updateServicesSection = async (req, res) => {
  try {
    console.log('Received services update:', req.body);
    const { sectionTitle, sectionDescription, services, partnersTitle, partnersList, isVisible } = req.body;
    
    let servicesSection = await ServicesSection.findOne();
    
    if (!servicesSection) {
      servicesSection = new ServicesSection();
    }
    
    if (sectionTitle !== undefined) servicesSection.sectionTitle = sectionTitle;
    if (sectionDescription !== undefined) servicesSection.sectionDescription = sectionDescription;
    if (services !== undefined) servicesSection.services = services;
    if (partnersTitle !== undefined) servicesSection.partnersTitle = partnersTitle;
    if (partnersList !== undefined) servicesSection.partnersList = partnersList;
    if (isVisible !== undefined) servicesSection.isVisible = isVisible;
    
    await servicesSection.save();
    console.log('Saved servicesSection:', servicesSection);
    res.json(servicesSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle services section visibility
// @route   PATCH /api/services/visibility
// @access  Private
const toggleServicesVisibility = async (req, res) => {
  try {
    let servicesSection = await ServicesSection.findOne();
    
    if (!servicesSection) {
      servicesSection = new ServicesSection();
    }
    
    servicesSection.isVisible = !servicesSection.isVisible;
    await servicesSection.save();
    
    res.json({ 
      message: `Services section ${servicesSection.isVisible ? 'enabled' : 'disabled'}`, 
      servicesSection 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getServicesSection,
  updateServicesSection,
  toggleServicesVisibility
};