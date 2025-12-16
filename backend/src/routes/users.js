const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { updatePreferences, getUserData } = require('../controllers/userController');

// All routes require authentication
router.use(protect);

// Update user preferences
router.put('/preferences', updatePreferences);

// Get user data
router.get('/data', getUserData);

// Get user profile (same as /data but different endpoint for frontend)
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Save meal plan (temporary placeholder)
router.put('/mealplan', async (req, res) => {
  try {
    const { mealPlan } = req.body;
    // For now, just accept it
    res.json({
      success: true,
      message: 'Meal plan saved (placeholder)',
      mealPlan
    });
  } catch (error) {
    console.error('Save meal plan error:', error);
    res.status(500).json({ success: false, error: 'Failed to save meal plan' });
  }
});

// Save ingredients (temporary placeholder)
router.put('/ingredients', async (req, res) => {
  try {
    const { ingredients } = req.body;
    res.json({
      success: true,
      message: 'Ingredients saved (placeholder)',
      ingredients
    });
  } catch (error) {
    console.error('Save ingredients error:', error);
    res.status(500).json({ success: false, error: 'Failed to save ingredients' });
  }
});

// Save recipes (temporary placeholder)
router.put('/recipes', async (req, res) => {
  try {
    const { recipes } = req.body;
    res.json({
      success: true,
      message: 'Recipes saved (placeholder)',
      recipes
    });
  } catch (error) {
    console.error('Save recipes error:', error);
    res.status(500).json({ success: false, error: 'Failed to save recipes' });
  }
});

module.exports = router;