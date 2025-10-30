import React, { useState } from 'react';
import './MealPlanner.css';

const MealPlanner = ({ mealPlan, onUpdateMealPlan, addedToMealPlan }) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const [draggedRecipe, setDraggedRecipe] = useState(null);

  const handleDragStart = (recipe) => {
    setDraggedRecipe(recipe);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (day) => {
    if (draggedRecipe) {
      onUpdateMealPlan(prev => ({
        ...prev,
        [day]: [...prev[day], { ...draggedRecipe, id: Date.now() }] // Unique ID
      }));
      setDraggedRecipe(null);
    }
  };

  const removeRecipe = (day, index) => {
    onUpdateMealPlan(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const clearDay = (day) => {
    onUpdateMealPlan(prev => ({
      ...prev,
      [day]: []
    }));
  };

  return (
    <div className="meal-planner">
      <h2>Weekly Meal Planner</h2>
      <p>Drag recipes to plan your week. Meals added from search will appear below.</p>
      
      {/* Available Recipes Section */}
      <div className="available-recipes-section">
        <h3>Available Recipes ({addedToMealPlan?.length || 0})</h3>
        {addedToMealPlan && addedToMealPlan.length > 0 ? (
          <div className="recipe-pool">
            {addedToMealPlan.map(recipe => (
              <div 
                key={recipe.id} 
                className="draggable-recipe"
                draggable
                onDragStart={() => handleDragStart(recipe)}
              >
                <img src={recipe.image} alt={recipe.title} />
                <span>{recipe.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-recipes">No recipes added yet. Go to Search to find recipes!</p>
        )}
      </div>

      {/* Weekly Grid */}
      <div className="week-grid">
        {days.map(day => (
          <div 
            key={day} 
            className="day-column"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(day)}
          >
            <div className="day-header">
              <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
              {mealPlan[day].length > 0 && (
                <button className="clear-day" onClick={() => clearDay(day)}>
                  Clear
                </button>
              )}
            </div>
            <div className="meal-slot">
              {mealPlan[day].map((recipe, index) => (
                <div key={`${day}-${index}`} className="meal-card">
                  <img src={recipe.image} alt={recipe.title} />
                  <h4>{recipe.title}</h4>
                  <button onClick={() => removeRecipe(day, index)}>Remove</button>
                </div>
              ))}
              {mealPlan[day].length === 0 && (
                <div className="empty-slot">
                  <p>Drop recipes here</p>
                  <small>or click + to add</small>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanner;