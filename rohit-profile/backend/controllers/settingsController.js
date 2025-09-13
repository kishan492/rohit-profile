const Settings = require('../models/Settings');

const getSettings = async (req, res) => {
  try {
    console.log('Getting settings...');
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      console.log('No settings found, creating default settings');
      settings = new Settings();
      await settings.save();
    }
    
    console.log('Settings retrieved successfully');
    res.json(settings);
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ message: 'Error retrieving settings', error: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    console.log('Updating settings with data:', req.body);
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings();
    }
    
    // Update all provided fields
    if (req.body.sectionVisibility) {
      settings.sectionVisibility = { ...settings.sectionVisibility, ...req.body.sectionVisibility };
    }
    
    if (req.body.siteInfo) {
      settings.siteInfo = { ...settings.siteInfo, ...req.body.siteInfo };
    }
    
    if (req.body.seoSettings) {
      settings.seoSettings = { ...settings.seoSettings, ...req.body.seoSettings };
    }
    
    if (req.body.performanceSettings) {
      settings.performanceSettings = { ...settings.performanceSettings, ...req.body.performanceSettings };
    }
    
    if (req.body.maintenanceSettings) {
      settings.maintenanceSettings = { ...settings.maintenanceSettings, ...req.body.maintenanceSettings };
    }
    
    await settings.save();
    
    console.log('Settings updated successfully');
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
};

const resetSettings = async (req, res) => {
  try {
    console.log('Resetting settings to defaults...');
    
    await Settings.deleteMany({});
    
    const defaultSettings = new Settings();
    await defaultSettings.save();
    
    console.log('Settings reset successfully');
    res.json({ 
      message: 'Settings reset to defaults successfully',
      settings: defaultSettings
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({ message: 'Error resetting settings', error: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  resetSettings
};