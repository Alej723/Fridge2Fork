const User = require('../models/User');

// Update user preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { dietary, allergies, otherAllergies } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        preferences: {
          dietary: dietary || [],
          allergies: allergies || [],
          otherAllergies: otherAllergies || ''
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Preferences updated',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ success: false, error: 'Failed to update preferences' });
  }
};

// Get user data
exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user data error:', error);
    res.status(500).json({ success: false, error: 'Failed to get user data' });
  }
};
