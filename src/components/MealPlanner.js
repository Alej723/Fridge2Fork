import React, { useState } from 'react';
import './MealPlanner.css';

const MealPlanner = ({ mealPlan, onUpdateMealPlan, addedToMealPlan }) => {
  const days = [
    { key: 'sunday', label: 'Sunday' },
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' }
  ];

  const [draggedRecipe, setDraggedRecipe] = useState(null);
  const [showDropdownForDay, setShowDropdownForDay] = useState(null);
  const [savingWeek, setSavingWeek] = useState(false);
  const [weekName, setWeekName] = useState('');

  const handleDragStart = (recipe) => setDraggedRecipe(recipe);
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (dayKey) => {
    if (!draggedRecipe) return;
    const updatedPlan = {
      ...mealPlan,
      [dayKey]: [...(mealPlan[dayKey] || []), { ...draggedRecipe, id: Date.now() }]
    };
    onUpdateMealPlan(updatedPlan);
    setDraggedRecipe(null);
  };

  const removeRecipe = (dayKey, index) => {
    const updatedPlan = {
      ...mealPlan,
      [dayKey]: (mealPlan[dayKey] || []).filter((_, i) => i !== index)
    };
    onUpdateMealPlan(updatedPlan);
  };

  const clearDay = (dayKey) => {
    const updatedPlan = { ...mealPlan, [dayKey]: [] };
    onUpdateMealPlan(updatedPlan);
  };

  const addRecipeToDay = (dayKey, recipe) => {
    const updatedPlan = {
      ...mealPlan,
      [dayKey]: [...(mealPlan[dayKey] || []), { ...recipe, id: Date.now() }]
    };
    onUpdateMealPlan(updatedPlan);
    setShowDropdownForDay(null);
  };

  const toggleDropdown = (dayKey) => {
    if (addedToMealPlan.length === 0) {
      alert('No recipes available. Go to Search to add recipes first!');
      return;
    }
    setShowDropdownForDay(showDropdownForDay === dayKey ? null : dayKey);
  };

  const saveCurrentWeek = async () => {
    if (savingWeek) {
      // Actually save
      try {
        // Check if meal plan is empty
        const totalRecipes = Object.values(mealPlan || {}).flat().length;
        if (totalRecipes === 0) {
          alert('Your meal plan is empty! Add some recipes first.');
          return;
        }

        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
        const token = localStorage.getItem('fridge2fork_token');
        
        const response = await fetch(`${apiUrl}/mealplans/save-week`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: weekName || `Week of ${new Date().toLocaleDateString()}`,
            days: mealPlan
          })
        });
        
        const data = await response.json();
        if (data.success) {
          alert(`Week "${weekName || 'My Week'}" saved to favorites!`);
          setWeekName('');
          setSavingWeek(false);
        } else {
          throw new Error(data.error || 'Failed to save week');
        }
      } catch (error) {
        console.error('Failed to save week:', error);
        alert('Failed to save week. Please try again.');
      }
    } else {
      // Show input
      setSavingWeek(true);
    }
  };

  return (
    <div className="meal-planner">
      <h2>Weekly Meal Planner</h2>
      <br></br>
      <p>Drag recipes to plan your week! Meals added from search will appear below:</p>

      {/* Available Recipes Section */}
      <div className="available-recipes-section">
        <h3>Available Recipes ({addedToMealPlan?.length || 0})</h3>
        {addedToMealPlan && addedToMealPlan.length > 0 ? (
          <div className="recipe-pool">
            {addedToMealPlan.map(recipe => (
              <div
                key={recipe.id}
                className="draggable-recipe-card"
                draggable
                onDragStart={() => handleDragStart(recipe)}
              >
                <img src={recipe.image} alt={recipe.title} />
                <div className="recipe-info">
                  <h4>{recipe.title}</h4>
                  <div className="quick-add-buttons">
                    {days.map(dayObj => (
                      <button
                        key={dayObj.key}
                        className="quick-add-btn"
                        onClick={() => addRecipeToDay(dayObj.key, recipe)}
                        title={`Add to ${dayObj.label}`}
                      >
                        {dayObj.label.charAt(0)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-recipes">No recipes added yet. Go to Search to find recipes!</p>
        )}
      </div>

      {/* Weekly Grid */}
      <div className="week-grid">
        {days.map(dayObj => (
          <div
            key={dayObj.key}
            className="day-column"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(dayObj.key)}
          >
            <div className="day-header">
              <h3>{dayObj.label}</h3>
              <div className="day-actions">
                <div className="dropdown-container">
                  <button
                    className="add-recipe-btn"
                    onClick={() => toggleDropdown(dayObj.key)}
                    title="Add a recipe"
                  >
                    +
                  </button>

                  {showDropdownForDay === dayObj.key && addedToMealPlan.length > 0 && (
                    <div className="recipe-dropdown">
                      <div className="dropdown-header">
                        <span>Choose a recipe:</span>
                        <button
                          className="close-dropdown"
                          onClick={() => setShowDropdownForDay(null)}
                        >
                          ×
                        </button>
                      </div>
                      <div className="dropdown-recipes">
                        {addedToMealPlan.map(recipe => (
                          <div
                            key={recipe.id}
                            className="dropdown-recipe-item"
                            onClick={() => addRecipeToDay(dayObj.key, recipe)}
                          >
                            <img src={recipe.image} alt={recipe.title} />
                            <span>{recipe.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {mealPlan[dayObj.key] && mealPlan[dayObj.key].length > 0 && (
                  <button className="clear-day" onClick={() => clearDay(dayObj.key)}>
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="meal-slot">
              {mealPlan[dayObj.key] && mealPlan[dayObj.key].map((recipe, index) => (
                <div key={`${dayObj.key}-${index}`} className="meal-card">
                  <img src={recipe.image} alt={recipe.title} />
                  <h4>{recipe.title}</h4>
                  <button onClick={() => removeRecipe(dayObj.key, index)}>Remove</button>
                </div>
              ))}

              {(!mealPlan[dayObj.key] || mealPlan[dayObj.key].length === 0) && (
                <div className="empty-slot">
                  <p>Drop recipes here</p>
                  <small>or click + to add</small>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Save Week Section */}
      <div className="save-week-section" style={{
        marginTop: '2rem',
        paddingTop: '1rem',
        borderTop: '2px solid #eee',
        textAlign: 'center'
      }}>
        {savingWeek ? (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Name this week (optional)"
              value={weekName}
              onChange={(e) => setWeekName(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '2px solid #000',
                borderRadius: '8px',
                minWidth: '200px',
                fontSize: '1rem'
              }}
            />
            <button
              onClick={saveCurrentWeek}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#000',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setSavingWeek(false);
                setWeekName('');
              }}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#ccc',
                color: 'black',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={saveCurrentWeek}
            style={{
              padding: '1rem 2rem',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.background = '#ff5252'}
            onMouseOut={(e) => e.target.style.background = '#ff6b6b'}
          >
            ❤︎ Save This Week to Favorites ❤︎
          </button>
        )}
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
          Save your current meal plan to access it later
        </p>
      </div>
    </div>
  );
};

export default MealPlanner;