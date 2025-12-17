const mongoose = require('mongoose');
const SavedRecipe = require('./src/models/SavedRecipe');
const MealPlan = require('./src/models/MealPlan');
const SavedWeek = require('./src/models/SavedWeek');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

const cleanupDemoUser = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find demo user by email
    const User = require('./src/models/User');
    const demoUser = await User.findOne({ email: 'demo@fridge2fork.com' });
    
    if (!demoUser) {
      console.log('Demo user not found');
      await mongoose.disconnect();
      return;
    }
    
    console.log('Found demo user:', demoUser.email);
    
    // 1. Remove duplicate saved recipes
    const savedRecipes = await SavedRecipe.find({ user: demoUser._id });
    console.log(`Found ${savedRecipes.length} saved recipes`);
    
    // Find duplicates by title
    const seenTitles = new Set();
    const duplicates = [];
    
    savedRecipes.forEach(recipe => {
      if (seenTitles.has(recipe.title)) {
        duplicates.push(recipe._id);
      } else {
        seenTitles.add(recipe.title);
      }
    });
    
    if (duplicates.length > 0) {
      console.log(`Removing ${duplicates.length} duplicate recipes`);
      await SavedRecipe.deleteMany({ _id: { $in: duplicates } });
    }
    
    // 2. Clean up meal plans
    const mealPlans = await MealPlan.find({ user: demoUser._id });
    console.log(`Found ${mealPlans.length} meal plans`);
    
    // Remove duplicates from meal plan days
    for (const mealPlan of mealPlans) {
      let hasDuplicates = false;
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      
      days.forEach(day => {
        if (mealPlan.days[day]) {
          const seen = new Set();
          mealPlan.days[day] = mealPlan.days[day].filter(recipe => {
            const key = recipe.title;
            if (seen.has(key)) {
              hasDuplicates = true;
              return false;
            }
            seen.add(key);
            return true;
          });
        }
      });
      
      if (hasDuplicates) {
        await mealPlan.save();
        console.log('Removed duplicates from meal plan');
      }
    }
    
    console.log('Demo user cleanup complete!');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Cleanup error:', error);
    process.exit(1);
  }
};

cleanupDemoUser();