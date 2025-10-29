import React from 'react';
import './MealPlanner.css';

const MealPlanner = ({ mealPlan, onUpdateMealPlan }) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

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
      <p>Your planned meals for the week</p>
      
      <div className="week-grid">
        {days.map(day => (
          <div key={day} className="day-column">
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
                <div key={index} className="meal-card">
                  <img src={recipe.image} alt={recipe.title} />
                  <h4>{recipe.title}</h4>
                  <button onClick={() => removeRecipe(day, index)}>Remove</button>
                </div>
              ))}
              {mealPlan[day].length === 0 && (
                <div className="empty-slot">
                  <p>No meals planned</p>
                  <small>Add recipes from the search page</small>
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