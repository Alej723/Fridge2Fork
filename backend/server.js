const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// SIMPLE IN-MEMORY DATABASE
let users = [];
let userData = {};

// 1. HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    message: 'Fridge2Fork API is running',
    timestamp: new Date().toISOString()
  });
});

// 2. REGISTER USER
app.post('/api/register', (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ 
        success: false,
        error: 'User with this email already exists' 
      });
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password // Note: In production, hash this!
    };
    
    users.push(newUser);
    
    // Initialize user data
    userData[newUser.id] = {
      preferences: {
        dietary: [],
        allergies: [],
        otherAllergies: ''
      },
      mealPlan: {
        sunday: [], monday: [], tuesday: [], wednesday: [], thursday: [],
        friday: [], saturday: []
      },
      savedRecipes: [],
      ingredients: []
    };
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to create account' 
    });
  }
});

// 3. LOGIN USER
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }
    
    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferences: userData[user.id].preferences
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Login failed' 
    });
  }
});

// 4. GET USER DATA
app.get('/api/users/:userId/data', (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userData[userId]) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    const user = users.find(u => u.id === userId);
    
    res.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        preferences: userData[userId].preferences
      },
      mealPlan: userData[userId].mealPlan,
      savedRecipes: userData[userId].savedRecipes,
      userIngredients: userData[userId].ingredients
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch user data' 
    });
  }
});

// 5. UPDATE USER PREFERENCES
app.put('/api/users/:userId/preferences', (req, res) => {
  try {
    const { userId } = req.params;
    const { preferences } = req.body;
    
    if (!userData[userId]) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    userData[userId].preferences = preferences;
    
    res.json({ 
      success: true,
      message: 'Preferences updated successfully!',
      preferences 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to update preferences' 
    });
  }
});

// 6. UPDATE MEAL PLAN
app.put('/api/users/:userId/mealplan', (req, res) => {
  try {
    const { userId } = req.params;
    const { mealPlan } = req.body;
    
    if (!userData[userId]) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    userData[userId].mealPlan = mealPlan;
    
    res.json({ 
      success: true,
      message: 'Meal plan saved successfully!',
      mealPlan 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to save meal plan' 
    });
  }
});

// 7. UPDATE SAVED RECIPES
app.put('/api/users/:userId/recipes', (req, res) => {
  try {
    const { userId } = req.params;
    const { recipes } = req.body;
    
    if (!userData[userId]) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    userData[userId].savedRecipes = recipes;
    
    res.json({ 
      success: true,
      message: 'Recipes saved successfully!',
      recipes 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to save recipes' 
    });
  }
});

// 8. UPDATE INGREDIENTS
app.put('/api/users/:userId/ingredients', (req, res) => {
  try {
    const { userId } = req.params;
    const { ingredients } = req.body;
    
    if (!userData[userId]) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    userData[userId].ingredients = ingredients;
    
    res.json({ 
      success: true,
      message: 'Ingredients saved successfully!',
      ingredients 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to save ingredients' 
    });
  }
});

// Start server
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`🚀 Fridge2Fork Backend running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`👤 Register: POST http://localhost:${PORT}/api/register`);
  console.log(`🔐 Login: POST http://localhost:${PORT}/api/login`);
  console.log(`📊 In-memory storage active - data persists while server runs`);
});
