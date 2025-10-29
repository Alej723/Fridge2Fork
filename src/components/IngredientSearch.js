import React, { useState } from 'react';
import axios from 'axios';
import './IngredientSearch.css';

const IngredientSearch = ({ onAddToMealPlan }) => {
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeDetail, setShowRecipeDetail] = useState(false);

  const API_KEY = '6be7bde14d4549439a1361a567311b2f';

  const addIngredient = () => {
    if (ingredientInput.trim() && !ingredients.includes(ingredientInput.trim())) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const removeIngredient = (ingredientToRemove) => {
    setIngredients(ingredients.filter(ing => ing !== ingredientToRemove));
  };

  const handleSearch = async () => {
    if (ingredients.length === 0) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients`,
        {
          params: {
            ingredients: ingredients.join(','),
            number: 9,
            apiKey: API_KEY,
            ranking: 2
          }
        }
      );
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      alert('Failed to fetch recipes. Please try again.');
    }
    setLoading(false);
  };

  const popularIngredients = [
    'Chicken', 'Rice', 'Broccoli', 'Pasta', 'Tomato', 
    'Cheese', 'Eggs', 'Bread', 'Milk', 'Potatoes',
    'Carrots', 'Onion', 'Garlic', 'Beef', 'Fish'
  ];

  const addPopularIngredient = (ingredient) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
  };

  // Add this function to handle adding to meal planner
  const addToMealPlan = (recipe, event) => {
    event.stopPropagation();
    if (onAddToMealPlan) {
      onAddToMealPlan(recipe);
      alert(`Added "${recipe.title}" to your meal plan!`);
    }
  };

  // Also update the modal button:
  const addToMealPlanFromModal = () => {
    if (onAddToMealPlan && selectedRecipe) {
      onAddToMealPlan(selectedRecipe);
      setShowRecipeDetail(false);
      alert(`Added "${selectedRecipe.title}" to your meal plan!`);
    }
  };

  // Add this function to show recipe details
  const showRecipeDetails = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeDetail(true);
  };

  return (
    <div className="ingredient-search">
      <div className="search-header">
        <h1>What ingredients do you have?</h1>
        <p>Add ingredients from your fridge or pantry to find matching recipes</p>
      </div>

      {/* Input Section */}
      <div className="input-section">
        <div className="input-group">
          <input
            type="text"
            placeholder="Type an ingredient (e.g., chicken, rice, tomatoes)..."
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
            className="ingredient-input"
          />
          <button onClick={addIngredient} className="add-button">
            Add
          </button>
        </div>
        
        <button 
          onClick={handleSearch} 
          disabled={loading || ingredients.length === 0}
          className="search-button"
        >
          {loading ? 'Searching...' : `Find Recipes (${ingredients.length})`}
        </button>
      </div>

      {/* Added Ingredients Grid */}
      {ingredients.length > 0 && (
        <div className="ingredients-grid-section">
          <h3>Your Ingredients</h3>
          <div className="ingredients-grid">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-card">
                <span className="ingredient-name">{ingredient}</span>
                <button 
                  onClick={() => removeIngredient(ingredient)}
                  className="remove-button"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Ingredients */}
      <div className="popular-ingredients-section">
        <h3>Popular Ingredients</h3>
        <div className="popular-ingredients-grid">
          {popularIngredients.map((ingredient, index) => (
            <button
              key={index}
              onClick={() => addPopularIngredient(ingredient)}
              className="popular-ingredient"
              disabled={ingredients.includes(ingredient)}
            >
              {ingredient}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Results */}
      {recipes.length > 0 && (
        <div className="recipe-results-section">
          <h3>Found {recipes.length} Recipes</h3>
          <div className="recipe-grid">
            {recipes.map(recipe => (
              <div 
                key={recipe.id} 
                className="recipe-card"
                onClick={() => showRecipeDetails(recipe)}
              >
                <div className="recipe-image">
                  <img src={recipe.image} alt={recipe.title} />
                  <div className="recipe-stats">
                    <span className="used">✅ {recipe.usedIngredientCount}</span>
                    <span className="missing">❌ {recipe.missedIngredientCount}</span>
                  </div>
                </div>
                <div className="recipe-info">
                  <h4>{recipe.title}</h4>
                  <div className="recipe-meta">
                    <span>Uses {recipe.usedIngredientCount} ingredients you have</span>
                  </div>
                  <button 
                    className="add-to-planner"
                    onClick={(e) => addToMealPlan(recipe, e)}
                  >
                    Add to Meal Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {showRecipeDetail && selectedRecipe && (
        <div className="recipe-modal">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowRecipeDetail(false)}>×</button>
            <h2>{selectedRecipe.title}</h2>
            <img src={selectedRecipe.image} alt={selectedRecipe.title} />
            <div className="recipe-details">
              <p><strong>Uses {selectedRecipe.usedIngredientCount} ingredients you have</strong></p>
              <p><strong>Needs {selectedRecipe.missedIngredientCount} additional ingredients</strong></p>
            </div>
            <button className="add-to-planner-large" onClick={addToMealPlanFromModal}>Add to Meal Plan</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientSearch;