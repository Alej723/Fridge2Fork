const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');
const SavedRecipe = require('../models/SavedRecipe');

// Search recipes by ingredients
router.post('/search', protect, async (req, res) => {
  try {
    const { ingredients, preferences } = req.body;
    
    // Call Spoonacular API
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients`,
      {
        params: {
          ingredients: ingredients.join(','),
          number: 10,
          apiKey: process.env.SPOONACULAR_API_KEY,
          ranking: 2,
          ignorePantry: true
        }
      }
    );

    // Get detailed information for each recipe
    const detailedRecipes = await Promise.all(
      response.data.map(async (recipe) => {
        try {
          const detailResponse = await axios.get(
            `https://api.spoonacular.com/recipes/${recipe.id}/information`,
            {
              params: {
                apiKey: process.env.SPOONACULAR_API_KEY,
                includeNutrition: false
              }
            }
          );
          
          return {
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            usedIngredientCount: recipe.usedIngredientCount,
            missedIngredientCount: recipe.missedIngredientCount,
            extendedIngredients: detailResponse.data.extendedIngredients || [],
            instructions: detailResponse.data.instructions || '',
            readyInMinutes: detailResponse.data.readyInMinutes || 30,
            vegetarian: detailResponse.data.vegetarian || false,
            vegan: detailResponse.data.vegan || false,
            glutenFree: detailResponse.data.glutenFree || false,
            dairyFree: detailResponse.data.dairyFree || false
          };
        } catch (error) {
          console.error(`Error fetching details for recipe ${recipe.id}:`, error);
          return recipe; // Return basic info if detail fetch fails
        }
      })
    );

    // Filter by preferences if provided
    let filteredRecipes = detailedRecipes;
    if (preferences) {
      filteredRecipes = detailedRecipes.filter(recipe => {
        // Check dietary restrictions
        if (preferences.dietary.includes('Vegetarian') && !recipe.vegetarian) return false;
        if (preferences.dietary.includes('Vegan') && !recipe.vegan) return false;
        if (preferences.dietary.includes('Gluten-Free') && !recipe.glutenFree) return false;
        if (preferences.dietary.includes('Dairy-Free') && !recipe.dairyFree) return false;
        
        // Check for Halal
        if (preferences.dietary.includes('Halal')) {
          const nonHalalKeywords = ['pork', 'bacon', 'ham', 'gelatin', 'alcohol', 'wine', 'beer', 'lard'];
          const recipeText = (recipe.title + ' ' + recipe.extendedIngredients?.map(ing => ing.name).join(' ')).toLowerCase();
          if (nonHalalKeywords.some(keyword => recipeText.includes(keyword))) {
            return false;
          }
        }
        
        // Check allergies
        const allergenKeywords = {
          'Nuts': ['nut', 'almond', 'walnut', 'pecan', 'cashew', 'pistachio', 'hazelnut', 'peanut'],
          'Shellfish': ['shrimp', 'crab', 'lobster', 'shellfish', 'prawn'],
          'Eggs': ['egg', 'mayonnaise'],
          'Soy': ['soy', 'tofu', 'edamame', 'soybean'],
          'Wheat': ['wheat', 'flour', 'bread', 'pasta'],
          'Fish': ['fish', 'salmon', 'tuna', 'cod', 'tilapia']
        };
        
        for (const allergen of preferences.allergies) {
          const keywords = allergenKeywords[allergen] || [allergen.toLowerCase()];
          const recipeText = (recipe.title + ' ' + recipe.extendedIngredients?.map(ing => ing.name).join(' ')).toLowerCase();
          if (keywords.some(keyword => recipeText.includes(keyword))) {
            return false;
          }
        }
        
        return true;
      });
    }

    res.json({
      success: true,
      recipes: filteredRecipes,
      usingApi: true
    });
    
  } catch (error) {
    console.error('Spoonacular API error:', error.message);
    
    // Return mock data as fallback
    const mockRecipes = require('../mockRecipes');
    res.json({
      success: true,
      recipes: mockRecipes,
      usingApi: false,
      message: 'Using demo data due to API limits'
    });
  }
});

// Save recipe
router.post('/save', protect, async (req, res) => {
  try {
    const { recipe } = req.body;

    if (!recipe) {
      return res.status(400).json({ success: false, error: 'Recipe data required' });
    }

    const savedRecipe = await SavedRecipe.create({
      user: req.userId,
      recipeId: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      vegetarian: recipe.vegetarian,
      vegan: recipe.vegan,
      glutenFree: recipe.glutenFree,
      dairyFree: recipe.dairyFree,
      extendedIngredients: recipe.extendedIngredients,
      instructions: recipe.instructions
    });

    res.json({ success: true, savedRecipe });
  } catch (error) {
    console.error('Save recipe error:', error);
    res.status(500).json({ success: false, error: 'Failed to save recipe' });
  }
});

module.exports = router;