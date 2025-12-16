const mongoose = require('mongoose');
const User = require('./src/models/User');
const MealPlan = require('./src/models/MealPlan');
require('dotenv').config();

const createDemoUserWithData = async () => {
  try {
    // Use environment variable (Railway will provide this)
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set!');
      console.error('Please set it before running this script.');
      console.error('Example: MONGODB_URI="connection_string" node createDemoUser.js');
      process.exit(1);
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // [Rest of your existing code remains exactly the same...]
    // Check if demo user exists
    let demoUser = await User.findOne({ email: 'demo@fridge2fork.com' });
    
    if (!demoUser) {
      // Create demo user
      demoUser = new User({
        email: 'demo@fridge2fork.com',
        password: 'demo123',
        name: 'Demo User',
        preferences: {
          dietary: ['Vegetarian', 'Halal'],
          allergies: ['Nuts'],
          otherAllergies: 'sesame'
        }
      });
      await demoUser.save();
      console.log('Demo user created successfully!');
    } else {
      console.log('Demo user already exists');
    }
    
    // Create or update meal plan for demo user
    const demoMealPlan = {
      sunday: [],
      monday: [
        {
          recipeId: "2",
          title: "Vegetable Stir Fry",
          image: "https://spoonacular.com/recipeImages/2-312x231.jpg",
          time: "20 min",
          notes: "Great for lunch",
          addedAt: new Date()
        }
      ],
      tuesday: [
        {
          recipeId: "3",
          title: "Chicken Salad",
          image: "https://spoonacular.com/recipeImages/3-312x231.jpg",
          time: "15 min",
          notes: "Quick dinner",
          addedAt: new Date()
        }
      ],
      wednesday: [],
      thursday: [
        {
          recipeId: "9",
          title: "Falafel Wrap",
          image: "https://spoonacular.com/recipeImages/9-312x231.jpg",
          time: "25 min",
          notes: "Vegetarian option",
          addedAt: new Date()
        }
      ],
      friday: [],
      saturday: []
    };
    
    let mealPlan = await MealPlan.findOne({ user: demoUser._id });
    
    if (mealPlan) {
      mealPlan.days = demoMealPlan;
      await mealPlan.save();
      console.log('Demo meal plan updated in database');
    } else {
      mealPlan = new MealPlan({
        user: demoUser._id,
        days: demoMealPlan
      });
      await mealPlan.save();
      console.log('Demo meal plan created in database');
    }
    
    console.log('\nDemo setup complete!');
    console.log('Email: demo@fridge2fork.com');
    console.log('Password: demo123');
    console.log('\nYou can now use these credentials to login.');
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating demo data:', error.message);
    if (error.message.includes('Authentication failed')) {
      console.error('   This usually means:');
      console.error('   1. Wrong MongoDB username/password');
      console.error('   2. IP address not whitelisted in MongoDB Atlas');
      console.error('   3. Database name incorrect');
    }
    process.exit(1);
  }
};

createDemoUserWithData();