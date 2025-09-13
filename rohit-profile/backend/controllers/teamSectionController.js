const TeamSection = require('../models/TeamSection');

// @desc    Get team section data
// @route   GET /api/team
// @access  Public
const getTeamSection = async (req, res) => {
  try {
    let teamSection = await TeamSection.findOne();
    
    // If no team section exists, create one with default data
    if (!teamSection) {
      teamSection = new TeamSection({
        members: [
          {
            name: 'John Doe',
            role: 'Founder & CEO',
            location: 'San Francisco, CA',
            bio: 'Visionary leader with 10+ years in tech and business development. Passionate about building digital solutions that make a difference.',
            initials: 'JD',
            skills: ['Strategy', 'Leadership', 'Product Vision'],
            social: { linkedin: '#', twitter: '#', github: '#', email: '' }
          },
          {
            name: 'Sarah Johnson',
            role: 'Lead Developer',
            location: 'Seattle, WA',
            bio: 'Full-stack developer specializing in React, Node.js, and cloud architecture. Loves creating scalable and performant applications.',
            initials: 'SJ',
            skills: ['React', 'Node.js', 'AWS'],
            social: { linkedin: '#', twitter: '#', github: '#', email: '' }
          },
          {
            name: 'Michael Chen',
            role: 'UI/UX Designer',
            location: 'New York, NY',
            bio: 'Creative designer focused on user experience and modern interfaces. Believes great design should be both beautiful and functional.',
            initials: 'MC',
            skills: ['Design', 'Figma', 'Prototyping'],
            social: { linkedin: '#', twitter: '#', github: '#', email: '' }
          },
          {
            name: 'Emily Rodriguez',
            role: 'Content Creator',
            location: 'Austin, TX',
            bio: 'Content strategist and video producer. Specializes in educational content and brand storytelling across digital platforms.',
            initials: 'ER',
            skills: ['Video', 'Writing', 'Strategy'],
            social: { linkedin: '#', twitter: '#', github: '#', email: '' }
          },
          {
            name: 'David Kim',
            role: 'Real Estate Consultant',
            location: 'Los Angeles, CA',
            bio: 'Real estate expert with deep market knowledge and investment strategies. Helps clients make informed property decisions.',
            initials: 'DK',
            skills: ['Real Estate', 'Investment', 'Analysis'],
            social: { linkedin: '#', twitter: '#', github: '#', email: '' }
          },
          {
            name: 'Lisa Thompson',
            role: 'Marketing Director',
            location: 'Chicago, IL',
            bio: 'Digital marketing specialist driving growth through data-driven strategies and creative campaigns across multiple channels.',
            initials: 'LT',
            skills: ['Marketing', 'Analytics', 'Growth'],
            social: { linkedin: '#', twitter: '#', github: '#', email: '' }
          }
        ]
      });
      await teamSection.save();
    }
    
    res.json(teamSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update team section data
// @route   PUT /api/team
// @access  Private
const updateTeamSection = async (req, res) => {
  try {
    console.log('Received team update:', req.body);
    const { sectionTitle, sectionDescription, members, ctaTitle, ctaDescription, ctaButtonText, isVisible } = req.body;
    
    let teamSection = await TeamSection.findOne();
    
    if (!teamSection) {
      teamSection = new TeamSection();
    }
    
    // Update fields if provided
    if (sectionTitle !== undefined && sectionTitle !== '') teamSection.sectionTitle = sectionTitle;
    if (sectionDescription !== undefined && sectionDescription !== '') teamSection.sectionDescription = sectionDescription;
    if (members !== undefined) teamSection.members = members;
    if (ctaTitle !== undefined && ctaTitle !== '') teamSection.ctaTitle = ctaTitle;
    if (ctaDescription !== undefined && ctaDescription !== '') teamSection.ctaDescription = ctaDescription;
    if (ctaButtonText !== undefined && ctaButtonText !== '') teamSection.ctaButtonText = ctaButtonText;
    if (isVisible !== undefined) teamSection.isVisible = isVisible;
    
    await teamSection.save();
    console.log('Saved teamSection:', teamSection);
    res.json(teamSection);
  } catch (error) {
    console.error('Error updating team section:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle team section visibility
// @route   PATCH /api/team/visibility
// @access  Private
const toggleTeamVisibility = async (req, res) => {
  try {
    let teamSection = await TeamSection.findOne();
    
    if (!teamSection) {
      teamSection = new TeamSection();
    }
    
    teamSection.isVisible = !teamSection.isVisible;
    await teamSection.save();
    
    res.json({ 
      message: `Team section ${teamSection.isVisible ? 'enabled' : 'disabled'}`, 
      teamSection 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset team section to defaults
// @route   POST /api/team/reset
// @access  Private
const resetTeamSection = async (req, res) => {
  try {
    await TeamSection.deleteMany({});
    const teamSection = new TeamSection();
    await teamSection.save();
    
    res.json({ message: 'Team section reset to defaults', teamSection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTeamSection,
  updateTeamSection,
  toggleTeamVisibility,
  resetTeamSection
};