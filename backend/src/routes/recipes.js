const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');
const SavedRecipe = require('../models/SavedRecipe');

// In-memory cache
const recipeCache = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Helper function to generate cache key
const generateCacheKey = (ingredients, preferences) => {
  const sortedIngredients = [...ingredients].sort().join(',');
  const prefsString = JSON.stringify(preferences || {});
  return `${sortedIngredients}:${prefsString}`;
};

// Search recipes by ingredients
router.post('/search', protect, async (req, res) => {
  try {
    const { ingredients, preferences } = req.body;
    
    console.log('\n=== RECIPE SEARCH REQUEST ===');
    console.log('Ingredients:', ingredients);
    console.log('Preferences:', preferences || 'none');
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Ingredients array is required' 
      });
    }

    // Check cache first
    const cacheKey = generateCacheKey(ingredients, preferences);
    const cachedResult = recipeCache.get(cacheKey);
    
    if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_DURATION) {
      console.log('✅ Serving from cache');
      return res.json({
        success: true,
        recipes: cachedResult.data,
        usingApi: cachedResult.usingApi || false,
        fromCache: true,
        message: 'Recipes loaded from cache'
      });
    }

    // Get API key
    const apiKey = process.env.SPOONACULAR_API_KEY;
    
    // If no API key or quota exceeded, use ONLY demo data
    if (!apiKey || apiKey.length < 20) {
      console.log('❌ No valid API key - using demo data only');
      const demoRecipes = getDemoRecipes(ingredients, preferences);
      return res.json({
        success: true,
        recipes: demoRecipes,
        usingApi: false,
        message: 'Using demo recipes (API not configured)'
      });
    }

    // Try real API
    console.log('🔍 Attempting real API search...');
    let apiSuccessful = false;
    let apiRecipes = [];
    
    try {
      // Step 1: Search by ingredients
      const searchResponse = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients`,
        {
          params: {
            ingredients: ingredients.join(','),
            number: 8,
            apiKey: apiKey,
            ranking: 2,
            ignorePantry: true
          },
          timeout: 8000
        }
      );
      
      if (searchResponse.data && searchResponse.data.length > 0) {
        console.log(`✅ Found ${searchResponse.data.length} recipes from API`);
        apiSuccessful = true;
        
        // Get details for top 4 recipes
        const recipeIds = searchResponse.data.slice(0, 4).map(r => r.id);
        
        for (let i = 0; i < recipeIds.length; i++) {
          try {
            const detailResponse = await axios.get(
              `https://api.spoonacular.com/recipes/${recipeIds[i]}/information`,
              {
                params: { apiKey: apiKey, includeNutrition: false },
                timeout: 5000
              }
            );
            
            const basicRecipe = searchResponse.data.find(r => r.id === recipeIds[i]);
            apiRecipes.push({
              id: detailResponse.data.id,
              title: detailResponse.data.title,
              image: detailResponse.data.image,
              usedIngredientCount: basicRecipe?.usedIngredientCount || 0,
              missedIngredientCount: basicRecipe?.missedIngredientCount || 0,
              extendedIngredients: detailResponse.data.extendedIngredients || [],
              instructions: detailResponse.data.instructions || '',
              readyInMinutes: detailResponse.data.readyInMinutes || 30,
              vegetarian: detailResponse.data.vegetarian || false,
              vegan: detailResponse.data.vegan || false,
              glutenFree: detailResponse.data.glutenFree || false,
              dairyFree: detailResponse.data.dairyFree || false
            });
            
            // Small delay
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (detailError) {
            console.log(`Skipping recipe ${recipeIds[i]} due to error`);
          }
        }
      }
      
    } catch (apiError) {
      console.log('❌ API failed:', apiError.message);
      apiSuccessful = false;
    }
    
    let finalRecipes = [];
    let usingApi = false;
    let message = '';
    
    if (apiSuccessful && apiRecipes.length > 0) {
      // Filter API recipes by preferences
      finalRecipes = filterRecipesByPreferences(apiRecipes, preferences || {});
      usingApi = true;
      message = 'Real recipes from Spoonacular API';
      
      if (finalRecipes.length === 0) {
        message = 'No API recipes match your preferences';
        // Fall back to demo data
        finalRecipes = getDemoRecipes(ingredients, preferences);
        usingApi = false;
      }
    } else {
      // Use demo data
      finalRecipes = getDemoRecipes(ingredients, preferences);
      usingApi = false;
      message = apiSuccessful ? 'No recipes found. Using demo recipes.' : 'API unavailable. Using demo recipes.';
    }
    
    // Remove duplicates by title
    finalRecipes = removeDuplicateRecipes(finalRecipes);
    
    // Cache the results
    recipeCache.set(cacheKey, {
      data: finalRecipes,
      timestamp: Date.now(),
      usingApi: usingApi
    });
    
    console.log(`🎯 Returning ${finalRecipes.length} recipes (${usingApi ? 'Real API' : 'Demo Data'})`);
    console.log('=== SEARCH COMPLETE ===\n');
    
    res.json({
      success: true,
      recipes: finalRecipes,
      usingApi: usingApi,
      count: finalRecipes.length,
      message: message
    });
    
  } catch (error) {
    console.error('❌ Recipe search error:', error.message);
    
    // Use demo data on error
    const demoRecipes = getDemoRecipes(req.body.ingredients || [], req.body.preferences || {});
    const uniqueRecipes = removeDuplicateRecipes(demoRecipes);
    
    res.json({
      success: true,
      recipes: uniqueRecipes,
      usingApi: false,
      message: 'Using demo recipes due to technical issue'
    });
  }
});

// Helper to remove duplicate recipes
function removeDuplicateRecipes(recipes) {
  const seen = new Set();
  return recipes.filter(recipe => {
    const key = recipe.title.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Helper function to filter recipes by preferences
function filterRecipesByPreferences(recipes, preferences) {
  if (!preferences || (preferences.dietary.length === 0 && preferences.allergies.length === 0 && !preferences.otherAllergies)) {
    return recipes;
  }
  
  return recipes.filter(recipe => {
    // Check dietary restrictions
    if (preferences.dietary.includes('Vegetarian') && !recipe.vegetarian) {
      return false;
    }
    if (preferences.dietary.includes('Vegan') && !recipe.vegan) {
      return false;
    }
    if (preferences.dietary.includes('Gluten-Free') && !recipe.glutenFree) {
      return false;
    }
    if (preferences.dietary.includes('Dairy-Free') && !recipe.dairyFree) {
      return false;
    }
    
    // Check for Halal (NO PORK, NO ALCOHOL)
    if (preferences.dietary.includes('Halal')) {
      const nonHalalKeywords = ['pork', 'bacon', 'ham', 'gelatin', 'alcohol', 'wine', 'beer', 'lard', 'rum', 'whiskey', 'vodka'];
      const recipeText = (recipe.title + ' ' + 
                         (recipe.extendedIngredients?.map(ing => ing.name).join(' ') || '') + ' ' +
                         (recipe.instructions || '')).toLowerCase();
      
      if (nonHalalKeywords.some(keyword => recipeText.includes(keyword))) {
        return false;
      }
    }
    
    // Check for Kosher
    if (preferences.dietary.includes('Kosher')) {
      const nonKosherKeywords = ['pork', 'shellfish', 'shrimp', 'crab', 'lobster'];
      const recipeText = (recipe.title + ' ' + 
                         (recipe.extendedIngredients?.map(ing => ing.name).join(' ') || '')).toLowerCase();
      
      if (nonKosherKeywords.some(keyword => recipeText.includes(keyword))) {
        return false;
      }
      
      // Check for mixing meat and dairy
      const hasMeat = ['beef', 'chicken', 'lamb', 'meat', 'steak', 'burger'].some(meat => 
        recipeText.includes(meat)
      );
      const hasDairy = ['cheese', 'milk', 'butter', 'cream', 'yogurt', 'parmesan'].some(dairy => 
        recipeText.includes(dairy)
      );
      
      if (hasMeat && hasDairy) {
        return false;
      }
    }
    
    // Check allergies
    const allergenKeywords = {
      'Nuts': ['nut', 'almond', 'walnut', 'pecan', 'cashew', 'pistachio', 'hazelnut', 'peanut', 'peanut butter'],
      'Shellfish': ['shrimp', 'crab', 'lobster', 'shellfish', 'prawn', 'crawfish'],
      'Eggs': ['egg', 'mayonnaise', 'mayo'],
      'Soy': ['soy', 'tofu', 'edamame', 'soybean', 'soya'],
      'Wheat': ['wheat', 'flour', 'bread', 'pasta', 'noodles', 'breadcrumbs'],
      'Fish': ['fish', 'salmon', 'tuna', 'cod', 'tilapia', 'trout', 'anchovy']
    };
    
    const recipeText = (recipe.title + ' ' + 
                       (recipe.extendedIngredients?.map(ing => ing.name).join(' ') || '')).toLowerCase();
    
    for (const allergen of preferences.allergies) {
      const keywords = allergenKeywords[allergen] || [allergen.toLowerCase()];
      if (keywords.some(keyword => recipeText.includes(keyword))) {
        return false;
      }
    }
    
    // Check other allergies
    if (preferences.otherAllergies && preferences.otherAllergies.trim()) {
      const otherAllergens = preferences.otherAllergies
        .split(',')
        .map(a => a.trim().toLowerCase())
        .filter(a => a.length > 0);
      
      if (otherAllergens.some(allergen => recipeText.includes(allergen))) {
        return false;
      }
    }
    
    return true;
  });
}

// Get demo recipes (NO duplicates, properly filtered)
function getDemoRecipes(ingredients, preferences) {
  const allDemoRecipes = require('../mockRecipes');
  
  // Filter by preferences first
  let filteredRecipes = filterRecipesByPreferences(allDemoRecipes, preferences || {});
  
  // If no ingredients provided, return filtered recipes
  if (!ingredients || ingredients.length === 0) {
    return removeDuplicateRecipes(filteredRecipes.slice(0, 8));
  }
  
  // Try to match with ingredients
  const userIngredientsLower = ingredients.map(ing => ing.toLowerCase());
  
  const matchedRecipes = filteredRecipes.map(recipe => {
    const matchingIngredients = recipe.extendedIngredients.filter(ing => 
      userIngredientsLower.some(userIng => 
        ing.name.toLowerCase().includes(userIng) || 
        userIng.includes(ing.name.toLowerCase())
      )
    ).length;
    
    return {
      ...recipe,
      usedIngredientCount: matchingIngredients,
      missedIngredientCount: recipe.extendedIngredients.length - matchingIngredients,
      matchScore: matchingIngredients
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
  
  // Remove duplicates and return top results
  return removeDuplicateRecipes(matchedRecipes.slice(0, 8));
}

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