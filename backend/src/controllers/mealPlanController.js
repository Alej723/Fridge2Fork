const MealPlan = require('../models/MealPlan');

// Get or create meal plan for current week
exports.getCurrentMealPlan = async (req, res) => {
  try {
    // Find meal plan for this user
    let mealPlan = await MealPlan.findOne({ user: req.user.id });
    
    // If no meal plan exists, create one
    if (!mealPlan) {
      mealPlan = await MealPlan.create({
        user: req.user.id,
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
};

// Update meal plan
exports.updateMealPlan = async (req, res) => {
  try {
    const { mealPlan } = req.body;

    let userMealPlan = await MealPlan.findOne({ user: req.user.id });
    
    if (!userMealPlan) {
      userMealPlan = await MealPlan.create({
        user: req.user.id,
        days: mealPlan
      });
    } else {
      userMealPlan.days = mealPlan;
      await userMealPlan.save();
    }

    res.json({
      success: true,
      message: 'Meal plan updated',
      mealPlan: userMealPlan.days
    });
  } catch (error) {
    console.error('Update meal plan error:', error);
    res.status(500).json({ success: false, error: 'Failed to update meal plan' });
  }
};