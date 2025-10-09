const ContactSection = require('../models/ContactSection');
const HomeSection = require('../models/HomeSection');
const AboutSection = require('../models/AboutSection');
const ServicesSection = require('../models/ServicesSection');

// Get contact information for chatbot
const getContactInfo = async (req, res) => {
  try {
    const contactData = await ContactSection.findOne();
    
    if (!contactData) {
      return res.status(404).json({ message: 'Contact information not found' });
    }

    const info = {
      email: contactData.email,
      phone: contactData.phone,
      whatsapp: contactData.whatsapp,
      location: contactData.location,
      businessHours: contactData.businessHours || 'Mon-Fri 9AM-6PM'
    };

    res.json(info);
  } catch (error) {
    console.error('Error fetching contact info:', error.message);
    res.status(500).json({ message: 'Failed to fetch contact information' });
  }
};

// Get comprehensive portfolio information for chatbot
const getPortfolioInfo = async (req, res) => {
  try {
    const [homeData, aboutData, servicesData, achievementsData, teamData] = await Promise.all([
      HomeSection.findOne(),
      AboutSection.findOne(),
      ServicesSection.findOne(),
      require('../models/AchievementsSection').findOne(),
      require('../models/TeamSection').findOne()
    ]);

    const info = {
      // Personal Info
      name: homeData?.name || 'Portfolio Owner',
      title: homeData?.title || 'Developer',
      tagline: homeData?.tagline || '',
      description: aboutData?.description || 'Skilled developer with expertise in web technologies',
      
      // Professional Details
      skills: aboutData?.skills || [],
      experience: aboutData?.experience || 'Multiple years of experience',
      education: aboutData?.education || [],
      certifications: aboutData?.certifications || [],
      
      // Services & Work
      services: servicesData?.services || [],
      specializations: servicesData?.specializations || [],
      
      // Achievements
      achievements: achievementsData?.achievements || [],
      projects: achievementsData?.projects || [],
      
      // Team & Collaboration
      teamSize: teamData?.members?.length || 1,
      workingStyle: aboutData?.workingStyle || 'Collaborative and client-focused',
      
      // Availability
      availability: aboutData?.availability || 'Available for new projects',
      responseTime: '24 hours',
      
      // Technologies
      frontendTech: aboutData?.frontendTechnologies || ['React', 'TypeScript', 'Next.js'],
      backendTech: aboutData?.backendTechnologies || ['Node.js', 'Express', 'MongoDB'],
      tools: aboutData?.tools || ['VS Code', 'Git', 'Docker']
    };

    res.json(info);
  } catch (error) {
    console.error('Error fetching portfolio info:', error.message);
    res.status(500).json({ message: 'Failed to fetch portfolio information' });
  }
};

module.exports = {
  getContactInfo,
  getPortfolioInfo
};