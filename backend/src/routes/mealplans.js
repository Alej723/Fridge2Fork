const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const MealPlan = require('../models/MealPlan');
const SavedWeek = require('../models/SavedWeek');

// Save current week as a saved week
router.post('/save-week', protect, async (req, res) => {
  try {
    const { name, days } = req.body;
    if (!days) return res.status(400).json({ success: false, error: 'Missing days data' });

    const savedWeek = await SavedWeek.create({ user: req.userId, name, days });
    res.json({ success: true, savedWeek });
  } catch (error) {
    console.error('Save week error:', error);
    res.status(500).json({ success: false, error: 'Failed to save week' });
  }
});

// Get all saved weeks for a user
router.get('/saved-weeks', protect, async (req, res) => {
  try {
    const savedWeeks = await SavedWeek.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, savedWeeks });
  } catch (error) {
    console.error('Get saved weeks error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch saved weeks' });
  }
});

// Load a saved week by ID
router.get('/saved-weeks/:id', protect, async (req, res) => {
  try {
    const savedWeek = await SavedWeek.findOne({ _id: req.params.id, user: req.userId });
    if (!savedWeek) return res.status(404).json({ success: false, error: 'Week not found' });
    res.json({ success: true, week: savedWeek });
  } catch (error) {
    console.error('Load saved week error:', error);
    res.status(500).json({ success: false, error: 'Failed to load week' });
  }
});

// Get or create meal plan for current week
router.get('/current', protect, async (req, res) => {
  try {
    // Find meal plan for this user
    let mealPlan = await MealPlan.findOne({ user: req.userId });
    
    // If no meal plan exists, create one
    if (!mealPlan) {
      mealPlan = await MealPlan.create({
        user: req.userId,
        days: {
          sunday: [],
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: []
        }
      });
    }

    res.json({
      success: true,
      mealPlan: mealPlan.days
    });
  } catch (error) {
    console.error('Get meal plan error:', error);
    res.status(500).json({ success: false, error: 'Failed to get meal plan' });
  }
});

// Update meal plan
router.put('/', protect, async (req, res) => {
  try {
    console.log('=== MEAL PLAN UPDATE REQUEST ===');
    console.log('User ID:', req.userId);
    console.log('Request body:', req.body);
    console.log('Meal plan data:', req.body.mealPlan);
    
    const { mealPlan } = req.body;
    
    if (!mealPlan) {
      console.error('No mealPlan in request body');
      return res.status(400).json({ 
        success: false, 
        error: 'Missing mealPlan in request body' 
      });
    }

    let userMealPlan = await MealPlan.findOne({ user: req.userId });
    
    if (!userMealPlan) {
      console.log('Creating new meal plan for user');
      userMealPlan = new MealPlan({
        user: req.userId,
        days: mealPlan
      });
    } else {
      console.log('Updating existing meal plan');
      userMealPlan.days = mealPlan;
    }
    
    await userMealPlan.save();
    console.log('Meal plan saved successfully');

    res.json({
      success: true,
      message: 'Meal plan updated',
      mealPlan: userMealPlan.days
    });
    
  } catch (error) {
    console.error('Update meal plan error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update meal plan',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;