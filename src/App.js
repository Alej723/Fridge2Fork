import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import IngredientSearch from './components/IngredientSearch';
import MealPlanner from './components/MealPlanner';
import GroceryList from './components/GroceryList';
import Profile from './components/Profile';
import Auth from './components/Auth';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [mealPlan, setMealPlan] = useState({
    monday: [], tuesday: [], wednesday: [], thursday: [],
    friday: [], saturday: [], sunday: []
  });

  const handleLogin = (userData) => {
    // In a real app, you'd verify credentials with a backend
    setUser({ email: userData.email, name: userData.name });
  };

  const handleSignup = (userData) => {
    // In a real app, you'd create a new user account
    setUser({ email: userData.email, name: userData.name });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpdatePreferences = (preferences) => {
    // Save preferences (in real app, send to backend)
    console.log('Saving preferences:', preferences);
  };

  const addRecipeToMealPlan = (recipe, day = null) => {
    if (!day) {
      // If no day specified, add to first available day
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      day = days.find(d => mealPlan[d].length === 0) || 'monday';
    }
    
    setMealPlan(prev => ({
      ...prev,
      [day]: [...prev[day], recipe]
    }));
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-content">
            <h1 className="main-title">🍴 Fridge2Fork</h1>
            <p className="tagline">Smart meal planning from fridge to fork</p>
          </div>
        </header>
        
        {user ? (
          <>
            <Navigation />
            <main className="main-content">
              <Routes>
                <Route path="/" element={
                  <IngredientSearch onAddToMealPlan={addRecipeToMealPlan} />
                } />
                <Route path="/planner" element={
                  <MealPlanner mealPlan={mealPlan} onUpdateMealPlan={setMealPlan} />
                } />
                <Route path="/grocery" element={<GroceryList />} />
                <Route path="/profile" element={
                  <Profile 
                    user={user} 
                    onLogout={handleLogout}
                    onUpdatePreferences={handleUpdatePreferences}
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