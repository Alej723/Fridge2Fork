const express = require('express');
const User = require('../models/User');
const MealPlan = require('../models/MealPlan');
const SavedRecipe = require('../models/SavedRecipe');
const UserIngredient = require('../models/UserIngredient');
const router = express.Router();

// Middleware to verify token
const { verifyToken } = require('./auth');

// Apply token verification to all user routes
router.use(verifyToken);

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user preferences
router.put('/preferences', async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { preferences },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      message: 'Preferences updated',
      preferences: user.preferences
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Get or create user data
router.get('/data', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    // Get or create meal plan
    let mealPlan = await MealPlan.findOne({ userId: req.userId });
    if (!mealPlan) {
      mealPlan = new MealPlan({
        userId: req.userId,
        mealPlan: {
          sunday: [], monday: [], tuesday: [], wednesday: [], thursday: [],
          friday: [], saturday: []
        }
      });
      await mealPlan.save();
    }

    // Get or create saved recipes
    let savedRecipes = await SavedRecipe.findOne({ userId: req.userId });
    if (!savedRecipes) {
      savedRecipes = new SavedRecipe({
        userId: req.userId,
        recipes: []
      });
      await savedRecipes.save();
    }

    // Get or create user ingredients
    let userIngredients = await UserIngredient.findOne({ userId: req.userId });
    if (!userIngredients) {
      userIngredients = new UserIngredient({
        userId: req.userId,
        ingredients: []
      });
      await userIngredients.save();
    }

    res.json({
      user,
      mealPlan: mealPlan.mealPlan,
      savedRecipes: savedRecipes.recipes,
      userIngredients: userIngredients.ingredients.map(i => i.name)
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Update meal plan
router.put('/mealplan', async (req, res) => {
  try {
    const { mealPlan } = req.body;
    
    const updated = await MealPlan.findOneAndUpdate(
      { userId: req.userId },
      { mealPlan },
      { new: true, upsert: true }
    );
    
    res.json({
      message: 'Meal plan saved',
      mealPlan: updated.mealPlan
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save meal plan' });
  }
});

// Update saved recipes
router.put('/recipes', async (req, res) => {
  try {
    const { recipes } = req.body;
    
    const updated = await SavedRecipe.findOneAndUpdate(
      { userId: req.userId },
      { recipes },
      { new: true, upsert: true }
    );
    
    res.json({
      message: 'Recipes saved',
      recipes: updated.recipes
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save recipes' });
  }
});

// Update user ingredients
router.put('/ingredients', async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    const ingredientsWithTimestamps = ingredients.map(name => ({
      name,
      addedAt: new Date()
    }));
    
    const updated = await UserIngredient.findOneAndUpdate(
      { userId: req.userId },
      { ingredients: ingredientsWithTimestamps },
      { new: true, upsert: true }
    );
    
    res.json({
      message: 'Ingredients saved',
      ingredients: updated.ingredients.map(i => i.name)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save ingredients' });
  }
});

// Toggle recipe favorite status
router.put('/recipes/:recipeId/favorite', async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { isFavorite } = req.body;
    
    const savedRecipes = await SavedRecipe.findOne({ userId: req.userId });
    if (!savedRecipes) {
      return res.status(404).json({ error: 'No saved recipes found' });
    }
    
    const recipe = savedRecipes.recipes.find(r => r.id == recipeId);
    if (recipe) {
      recipe.isFavorite = isFavorite;
      await savedRecipes.save();
    }
    
    res.json({ message: 'Favorite status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update favorite status' });
  }
});

module.exports = router;