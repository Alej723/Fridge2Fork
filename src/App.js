import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import IngredientSearch from './components/IngredientSearch';
import MealPlanner from './components/MealPlanner';
import GroceryList from './components/GroceryList';
import Profile from './components/Profile';
import Auth from './components/Auth';
import Toast from './components/Toast';
import './App.css';
import SavedWeeks from './components/SavedWeeks';

// API helper functions
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Helper to safely set localStorage
const safeSetLocalStorage = (key, value) => {
  if (value === undefined || value === null) {
    console.warn(`Attempted to store undefined/null at ${key}`);
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Helper to safely get and parse from localStorage
const safeGetLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined || item === 'undefined' || item === 'null') {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error parsing ${key}:`, error);
    return defaultValue;
  }
};

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
    
    if (!responseText) {
      return null;
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Response:', responseText);
      throw new Error('Invalid JSON response');
    }

    if (!response.ok) {
      // DON'T auto-logout on 401 - just throw error
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
  
  // Check if have both token and user string
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
      safeSetLocalStorage('user', updatedUser);
      return updatedUser;
    }
    return user; // Return the parsed user even if /me fails
  } catch (error) {
    console.error('Auth check failed:', error);
    
    // If token is invalid, clear it
    if (error.message.includes('Not authorized') || error.message.includes('Token expired')) {
      localStorage.removeItem('fridge2fork_token');
      localStorage.removeItem('user');
    }
    
    return null;
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
    const runSmokeTest = async () => {
      console.log('FRIDGE2FORK SMOKE TEST');
      
      // Test 1: Backend health
      try {
        const response = await fetch('http://localhost:5001/api/health');
        const data = await response.json();
        console.log('Backend health:', data.status);
      } catch (error) {
        console.log('Backend offline - using local mode');
      }
      
      // Test 2: LocalStorage
      const token = localStorage.getItem('fridge2fork_token');
      const user = localStorage.getItem('user');
      console.log('LocalStorage:', token ? 'Token exists' : 'No token', user ? 'User exists' : 'No user');
      
      // Test 3: Check demo data
      const demoMealPlan = localStorage.getItem('mealPlan_demo@fridge2fork.com');
      if (demoMealPlan) {
        console.log('Demo data loaded');
      }
      
      console.log('SMOKE TEST COMPLETE');
    };
    
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
    if (!loading) {
      runSmokeTest();
    }
  }, [loading]);

  // Load user-specific data when user changes
  useEffect(() => {
    if (user?.email) {
      console.log('Loading data for user:', user.email);
      
      // Load meal plan
      const savedMealPlan = safeGetLocalStorage(`mealPlan_${user.email}`, {
        sunday: [], monday: [], tuesday: [], wednesday: [], thursday: [],
        friday: [], saturday: []
      });
      setUserMealPlan(savedMealPlan);

      // Load added recipes
      const savedRecipes = safeGetLocalStorage(`addedRecipes_${user.email}`, []);
      setUserAddedRecipes(savedRecipes);

      // Load ingredients
      const savedIngredients = safeGetLocalStorage(`ingredients_${user.email}`, []);
      setUserIngredients(savedIngredients);

      // Load preferences
      const savedPreferences = safeGetLocalStorage(`preferences_${user.email}`, {
        dietary: [],
        allergies: [],
        otherAllergies: ''
      });
      setUserPreferences(savedPreferences);
      
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
    await loadUserDataFromBackend();
  };

  const handleSignup = (userData) => {
    console.log('Signup successful:', userData);
    setUser(userData);
    // Initialize empty data for new user
    safeSetLocalStorage(`mealPlan_${userData.email}`, {
      sunday: [], monday: [], tuesday: [], wednesday: [], thursday: [],
      friday: [], saturday: []
    });
    safeSetLocalStorage(`addedRecipes_${userData.email}`, []);
    safeSetLocalStorage(`ingredients_${userData.email}`, []);
    safeSetLocalStorage(`preferences_${userData.email}`, {
      dietary: [],
      allergies: [],
      otherAllergies: ''
    });
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
      safeSetLocalStorage(`preferences_${user.email}`, preferences);
      
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
  
  const [toasts, setToasts] = useState([]);

  // Helper function to add toast
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const loadUserDataFromBackend = async () => {
    try {
      // Load preferences from backend
      const prefsData = await apiRequest('/users/profile');
      if (prefsData.success && prefsData.user?.preferences) {
        setUserPreferences(prefsData.user.preferences);
        safeSetLocalStorage(`preferences_${user.email}`, prefsData.user.preferences);
      }

      // Load meal plan from backend
      const mealPlanData = await apiRequest('/mealplans/current');
      if (mealPlanData.success && mealPlanData.mealPlan) {
        setUserMealPlan(mealPlanData.mealPlan);
        safeSetLocalStorage(`mealPlan_${user.email}`, mealPlanData.mealPlan);
      }

      console.log('Data loaded from backend');

    } catch (error) {
      console.log('Using local data (backend sync failed):', error);
      // Fallback to localStorage (already handled elsewhere)
    }
  };

  // Update meal plan with backend-first sync
  const updateMealPlan = async (newMealPlan) => {
    console.log('Updating meal plan:', newMealPlan);
    setUserMealPlan(newMealPlan);
    
    if (user?.email) {
      safeSetLocalStorage(`mealPlan_${user.email}`, newMealPlan);
      
      // Try to sync with backend
      try {
        // Clean the data before sending to backend
        const cleanMealPlan = {};
        Object.keys(newMealPlan).forEach(day => {
          cleanMealPlan[day] = newMealPlan[day].map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            readyInMinutes: recipe.readyInMinutes,
            // Only include essential fields
            extendedIngredients: recipe.extendedIngredients ? 
              recipe.extendedIngredients.map(ing => ({
                name: ing.name,
                original: ing.original,
                unit: ing.unit
              })) : []
          }));
        });
        
        console.log('Sending cleaned data to backend:', cleanMealPlan);
        
        const response = await apiRequest('/mealplans', {
          method: 'PUT',
          body: JSON.stringify({ mealPlan: cleanMealPlan })
        });
        console.log('Backend response:', response);
        addToast('Meal plan saved to cloud!', 'success');
      } catch (error) {
        console.error('Failed to sync meal plan with backend:', error);
        addToast('Saved locally (cloud sync failed)', 'info');
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
        safeSetLocalStorage(`addedRecipes_${user.email}`, newRecipes);
      }
      addToast(`"${recipe.title}" added to meal plan!`, 'success');
    }
  };

  // Update ingredients and save to localStorage
  const updateUserIngredients = async (ingredients) => {
    console.log('Updating ingredients:', ingredients);
    setUserIngredients(ingredients);
    if (user?.email) {
      safeSetLocalStorage(`ingredients_${user.email}`, ingredients);
      
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
        {/* Toast notifications */}
        <div className="toast-container">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
            />
          ))}
        </div>
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
                <Route path="/saved-weeks" element={<SavedWeeks />} />
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