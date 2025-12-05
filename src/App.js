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
    sunday: [], monday: [], tuesday: [], wednesday: [], thursday: [],
    friday: [], saturday: []
  });
  const [addedToMealPlan, setAddedToMealPlan] = useState([]);
  const [userIngredients, setUserIngredients] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
  dietary: [],
  allergies: [],
  otherAllergies: ''
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
  setUserPreferences(preferences);
  console.log('Saving preferences:', preferences);
};

  const addRecipeToMealPlan = (recipe) => {
    if (!addedToMealPlan.find(r => r.id === recipe.id)) {
      setAddedToMealPlan(prev => [...prev, recipe]);
    }
  };

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
              addedToMealPlan={addedToMealPlan}
              setAddedToMealPlan={setAddedToMealPlan}
              setUserIngredients={setUserIngredients}
              userPreferences={userPreferences}
              />
              } />
                <Route path="/planner" element={
                  <MealPlanner 
                    mealPlan={mealPlan} 
                    onUpdateMealPlan={setMealPlan}
                    addedToMealPlan={addedToMealPlan}
                  />
                } />
                <Route path="/grocery" element={
                  <GroceryList 
                    mealPlan={mealPlan}
                    userIngredients={userIngredients}
                  />
                } />
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