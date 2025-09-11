const TeamSection = require('../models/TeamSection');

const getTeamSection = async (req, res) => {
  try {
    let teamSection = await TeamSection.findOne();
    if (!teamSection) {
      teamSection = new TeamSection();
      await teamSection.save();
    }
    res.json(teamSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTeamSection = async (req, res) => {
  try {
    const { sectionTitle, sectionDescription, members, isVisible } = req.body;
    let teamSection = await TeamSection.findOne();
    if (!teamSection) teamSection = new TeamSection();
    
    if (sectionTitle !== undefined) teamSection.sectionTitle = sectionTitle;
    if (sectionDescription !== undefined) teamSection.sectionDescription = sectionDescription;
    if (members !== undefined) teamSection.members = members;
    if (isVisible !== undefined) teamSection.isVisible = isVisible;
    
    await teamSection.save();
    res.json(teamSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleTeamVisibility = async (req, res) => {
  try {
    let teamSection = await TeamSection.findOne();
    if (!teamSection) teamSection = new TeamSection();
    teamSection.isVisible = !teamSection.isVisible;
    await teamSection.save();
    res.json({ message: `Team section ${teamSection.isVisible ? 'enabled' : 'disabled'}`, teamSection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTeamSection, updateTeamSection, toggleTeamVisibility };