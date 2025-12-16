import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import IngredientSearch from './components/IngredientSearch';
import MealPlanner from './components/MealPlanner';
import GroceryList from './components/GroceryList';
import Profile from './components/Profile';
import Auth from './components/Auth';
import './App.css';

// API helper functions
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('fridge2fork_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    const responseText = await response.text();
    
    // If empty response, return null
    if (!responseText) {
      return null;
    }

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Response:', responseText);
      throw new Error('Invalid JSON response');
    }

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

const checkAuth = async () => {
  const token = localStorage.getItem('fridge2fork_token');
  const userStr = localStorage.getItem('user');
  
  // Check if we have both token and user string
  if (!token || !userStr) {
    return null;
  }
  
  // Check if userStr is valid JSON
  let user;
  try {
    user = JSON.parse(userStr);
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('fridge2fork_token');
    return null;
  }
  
  try {
    // Try to get user data with the token
    const data = await apiRequest('/auth/me');
    if (data && data.success && data.user) {
      // Update stored user data with fresh data from backend
      const updatedUser = {
        email: user.email || data.user.email,
        name: user.name || data.user.name,
        ...data.user
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    return user; // Return the parsed user even if /me fails
  } catch (error) {
    console.error('Auth check failed:', error);
    // Token might be invalid, but keep user logged in locally
    // Let the user try to use the app, they'll get logged out if token fails
    return user;
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // User-specific states - loaded from localStorage based on user email
  const [userMealPlan, setUserMealPlan] = useState({
    sunday: [], monday: [], tuesday: [], wednesday: [], thursday: [],
    friday: [], saturday: []
  });
  
  const [userAddedRecipes, setUserAddedRecipes] = useState([]);
  const [userIngredients, setUserIngredients] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    dietary: [],
    allergies: [],
    otherAllergies: ''
  });

  // Check authentication on initial load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const authenticatedUser = await checkAuth();
        if (authenticatedUser) {
          console.log('User authenticated:', authenticatedUser);
          setUser(authenticatedUser);
        } else {
          console.log('No authenticated user found');
        }
      } catch (error) {
        console.error('Initial auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Load user-specific data when user changes
  useEffect(() => {
    if (user?.email) {
      console.log('Loading data for user:', user.email);
      
      // Load meal plan
      try {
        const savedMealPlan = localStorage.getItem(`mealPlan_${user.email}`);
        if (savedMealPlan) {
          setUserMealPlan(JSON.parse(savedMealPlan));
        }
      } catch (error) {
        console.error('Failed to load meal plan:', error);
      }

      // Load added recipes
      try {
        const savedRecipes = localStorage.getItem(`addedRecipes_${user.email}`);
        if (savedRecipes) {
          setUserAddedRecipes(JSON.parse(savedRecipes));
        }
      } catch (error) {
        console.error('Failed to load recipes:', error);
      }

      // Load ingredients
      try {
        const savedIngredients = localStorage.getItem(`ingredients_${user.email}`);
        if (savedIngredients) {
          setUserIngredients(JSON.parse(savedIngredients));
        }
      } catch (error) {
        console.error('Failed to load ingredients:', error);
      }

      // Load preferences
      try {
        const savedPreferences = localStorage.getItem(`preferences_${user.email}`);
        if (savedPreferences) {
          setUserPreferences(JSON.parse(savedPreferences));
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    } else {
      console.log('No user, clearing data');
      // Clear all data when no user is logged in
      setUserMealPlan({
        sunday: [], monday: [], tuesday: [], wednesday: [], thursday: [],
        friday: [], saturday: []
      });
      setUserAddedRecipes([]);
      setUserIngredients([]);
      setUserPreferences({
        dietary: [],
        allergies: [],
        otherAllergies: ''
      });
    }
  }, [user]);

  const handleLogin = async (userData) => {
    console.log('Login successful:', userData);
    setUser(userData);
  };

  const handleSignup = (userData) => {
    console.log('Signup successful:', userData);
    setUser(userData);
    // Initialize empty data for new user
    localStorage.setItem(`mealPlan_${userData.email}`, JSON.stringify({
      sunday: [], monday: [], tuesday: [], wednesday: [], thursday: [],
      friday: [], saturday: []
    }));
    localStorage.setItem(`addedRecipes_${userData.email}`, '[]');
    localStorage.setItem(`ingredients_${userData.email}`, '[]');
    localStorage.setItem(`preferences_${userData.email}`, JSON.stringify({
      dietary: [],
      allergies: [],
      otherAllergies: ''
    }));
  };

  const handleLogout = () => {
    console.log('Logging out');
    // Clear all auth data
    localStorage.removeItem('fridge2fork_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleUpdatePreferences = async (preferences) => {
    console.log('Updating preferences:', preferences);
    setUserPreferences(preferences);
    if (user?.email) {
      localStorage.setItem(`preferences_${user.email}`, JSON.stringify(preferences));
      
      // Try to sync with backend
      try {
        await apiRequest('/users/preferences', {
          method: 'PUT',
          body: JSON.stringify(preferences)
        });
        console.log('Preferences synced with backend');
      } catch (error) {
        console.error('Failed to sync preferences with backend:', error);
        // Continue with local storage only
      }
    }
  };

  // Update meal plan and save to localStorage
  const updateMealPlan = async (newMealPlan) => {
    console.log('Updating meal plan');
    setUserMealPlan(newMealPlan);
    if (user?.email) {
      localStorage.setItem(`mealPlan_${user.email}`, JSON.stringify(newMealPlan));
      
      // Try to sync with backend
      try {
        await apiRequest('/users/mealplan', {
          method: 'PUT',
          body: JSON.stringify({ mealPlan: newMealPlan })
        });
        console.log('Meal plan synced with backend');
      } catch (error) {
        console.error('Failed to sync meal plan with backend:', error);
        // Continue with local storage only
      }
    }
  };

  // Add recipe and save to localStorage
  const addRecipeToMealPlan = (recipe) => {
    console.log('Adding recipe to meal plan:', recipe.title);
    if (!userAddedRecipes.find(r => r.id === recipe.id)) {
      const newRecipes = [...userAddedRecipes, recipe];
      setUserAddedRecipes(newRecipes);
      if (user?.email) {
        localStorage.setItem(`addedRecipes_${user.email}`, JSON.stringify(newRecipes));
      }
    }
  };

  // Update ingredients and save to localStorage
  const updateUserIngredients = async (ingredients) => {
    console.log('Updating ingredients:', ingredients);
    setUserIngredients(ingredients);
    if (user?.email) {
      localStorage.setItem(`ingredients_${user.email}`, JSON.stringify(ingredients));
      
      // Try to sync with backend
      try {
        await apiRequest('/users/ingredients', {
          method: 'PUT',
          body: JSON.stringify({ ingredients })
        });
        console.log('Ingredients synced with backend');
      } catch (error) {
        console.error('Failed to sync ingredients with backend:', error);
        // Continue with local storage only
      }
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div style={{
          padding: '2rem',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <h2>Loading Fridge2Fork...</h2>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-content">
            <h1 className="main-title">Fridge2Fork</h1>
            <p className="tagline">Smart meal planning from fridge to fork</p>
          </div>
        </header>
        
        {user ? (
          <>
            <Navigation />
            <main className="main-content">
              <Routes>
                <Route path="/" element={
                  <IngredientSearch 
                    onAddToMealPlan={addRecipeToMealPlan}
                    addedToMealPlan={userAddedRecipes}
                    setAddedToMealPlan={setUserAddedRecipes}
                    setUserIngredients={updateUserIngredients}
                    userPreferences={userPreferences}
                  />
                } />
                <Route path="/planner" element={
                  <MealPlanner 
                    mealPlan={userMealPlan} 
                    onUpdateMealPlan={updateMealPlan}
                    addedToMealPlan={userAddedRecipes}
                  />
                } />
                <Route path="/grocery" element={
                  <GroceryList 
                    mealPlan={userMealPlan}
                    userIngredients={userIngredients}
                  />
                } />
                <Route path="/profile" element={
                  <Profile 
                    user={user} 
                    onLogout={handleLogout}
                    onUpdatePreferences={handleUpdatePreferences}
                    preferences={userPreferences}
                  />
                } />
              </Routes>
            </main>
          </>
        ) : (
          <Auth onLogin={handleLogin} onSignup={handleSignup} />
        )}
      </div>
    </Router>
  );
}

export default App;