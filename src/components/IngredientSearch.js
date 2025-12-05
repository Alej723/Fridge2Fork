import React, { useState } from 'react';
import axios from 'axios';
import './IngredientSearch.css';

const IngredientSearch = ({ onAddToMealPlan, setUserIngredients, userPreferences }) => {
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeDetail, setShowRecipeDetail] = useState(false);

  const API_KEY = '6be7bde14d4549439a1361a567311b2f';

// when we use the prefrences tab and return to the search its ensured that your not allowed certain recipies 

  const filterRecipesByPreferences = (recipesToFilter) => {
  if (!userPreferences || (userPreferences.dietary.length === 0 && userPreferences.allergies.length === 0 && !userPreferences.otherAllergies)) {
    return recipesToFilter;
  }

  return recipesToFilter.filter(recipe => {

    if (userPreferences.dietary.includes('Vegetarian') && !recipe.vegetarian) {
      return false;
    }
    if (userPreferences.dietary.includes('Vegan') && !recipe.vegan) {
      return false;
    }
    if (userPreferences.dietary.includes('Gluten-Free') && !recipe.glutenFree) {
      return false;
    }
    if (userPreferences.dietary.includes('Dairy-Free') && !recipe.dairyFree) {
      return false;
    }


    const allIngredients = recipe.extendedIngredients
      ?.map(ing => ing.name?.toLowerCase() || '')
      .join(' ') || '';
    
    const recipeTitle = recipe.title?.toLowerCase() || '';
    const fullRecipeText = `${allIngredients} ${recipeTitle}`;

    const allergenKeywords = {
      'Nuts': ['nut', 'almond', 'walnut', 'pecan', 'cashew', 'pistachio', 'hazelnut', 'peanut'],
      'Shellfish': ['shrimp', 'crab', 'lobster', 'shellfish', 'prawn', 'crawfish'],
      'Eggs': ['egg'],
      'Soy': ['soy', 'tofu', 'edamame'],
      'Wheat': ['wheat', 'flour'],
      'Fish': ['fish', 'salmon', 'tuna', 'cod', 'tilapia', 'trout']
    };

    for (const allergen of userPreferences.allergies) {
      const keywords = allergenKeywords[allergen] || [allergen.toLowerCase()];
      if (keywords.some(keyword => fullRecipeText.includes(keyword))) {
        return false;
      }
    }

    if (userPreferences.otherAllergies) {
      const otherAllergens = userPreferences.otherAllergies
        .split(',')
        .map(a => a.trim().toLowerCase())
        .filter(a => a.length > 0);
      
      if (otherAllergens.some(allergen => fullRecipeText.includes(allergen))) {
        return false;
      }
    }

    return true;
  });
};

  const addIngredient = () => {
    if (ingredientInput.trim() && !ingredients.includes(ingredientInput.trim())) {
      const newIngredients = [...ingredients, ingredientInput.trim()];
      setIngredients(newIngredients);
      setUserIngredients(newIngredients);
      setIngredientInput('');
    }
  };

  const removeIngredient = (ingredientToRemove) => {
    const newIngredients = ingredients.filter(ing => ing !== ingredientToRemove);
    setIngredients(newIngredients);
    setUserIngredients(newIngredients);
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
            number: 6, // Reduced this to save on API calls
            apiKey: API_KEY,
            ranking: 2
          }
        }
      );
      
      // Get detailed information for each recipe
      const detailedRecipes = await Promise.all(
        response.data.map(async (recipe) => {
          try {
            const detailResponse = await axios.get(
              `https://api.spoonacular.com/recipes/${recipe.id}/information`,
              {
                params: {
                  apiKey: API_KEY
                }
              }
            );
          return {
          ...recipe,
          extendedIngredients: detailResponse.data.extendedIngredients || [],
          instructions: detailResponse.data.instructions,
          readyInMinutes: detailResponse.data.readyInMinutes,
          vegetarian: detailResponse.data.vegetarian,
          vegan: detailResponse.data.vegan,
          glutenFree: detailResponse.data.glutenFree,
          dairyFree: detailResponse.data.dairyFree
          };
          } catch (error) {
            console.error(`Error fetching details for recipe ${recipe.id}:`, error);
            return {
              ...recipe,
              extendedIngredients: [],
              instructions: '',
              readyInMinutes: 0
            };
          }
        })
      );
      

      const filteredRecipes = filterRecipesByPreferences(detailedRecipes);
setRecipes(filteredRecipes);

if (filteredRecipes.length === 0 && detailedRecipes.length > 0) {
  alert('No recipes found matching your dietary preferences and allergies. Try adjusting your preferences.');
}


    } catch (error) {
      console.error('Error fetching recipes:', error);
      alert('Failed to fetch recipes. Please try again.');
    }
    setLoading(false);
  };

  // Add demo recipes as fallback
  const getDemoRecipes = () => {
    return [
      {
        id: 1,
        title: "Chicken and Rice",
        image: "https://spoonacular.com/recipeImages/1-312x231.jpg",
        usedIngredientCount: 2,
        missedIngredientCount: 3,
        extendedIngredients: [
          { id: 1, name: "chicken", original: "1 chicken breast" },
          { id: 2, name: "rice", original: "1 cup rice" },
          { id: 3, name: "broccoli", original: "1 cup broccoli" },
          { id: 4, name: "soy sauce", original: "2 tbsp soy sauce" },
          { id: 5, name: "garlic", original: "2 cloves garlic" }
        ],
        instructions: "<ol><li>Cook rice according to package instructions</li><li>Season chicken and cook until done</li><li>Steam broccoli</li><li>Combine everything and serve</li></ol>"
      },
      {
        id: 2,
        title: "Pasta with Tomato Sauce",
        image: "https://spoonacular.com/recipeImages/2-312x231.jpg",
        usedIngredientCount: 1,
        missedIngredientCount: 4,
        extendedIngredients: [
          { id: 6, name: "pasta", original: "200g pasta" },
          { id: 7, name: "tomato sauce", original: "1 cup tomato sauce" },
          { id: 8, name: "cheese", original: "1/2 cup grated cheese" },
          { id: 9, name: "basil", original: "Fresh basil leaves" },
          { id: 10, name: "olive oil", original: "1 tbsp olive oil" }
        ],
        instructions: "<ol><li>Cook pasta al dente</li><li>Heat tomato sauce</li><li>Combine pasta with sauce</li><li>Top with cheese and basil</li></ol>"
      }
    ];
  };

  // Analyze which ingredients user has vs needs
  const analyzeIngredients = (recipe, userIngredients) => {
    const userIngredientLower = userIngredients.map(ing => ing.toLowerCase());
    
    const hasIngredients = recipe.extendedIngredients.filter(ing => 
      userIngredientLower.some(userIng => 
        ing.name.toLowerCase().includes(userIng) || 
        userIng.includes(ing.name.toLowerCase())
      )
    );
    
    const missingIngredients = recipe.extendedIngredients.filter(ing => 
      !userIngredientLower.some(userIng => 
        ing.name.toLowerCase().includes(userIng) || 
        userIng.includes(ing.name.toLowerCase())
      )
    );
    
    return { hasIngredients, missingIngredients };
  };

  const popularIngredients = [
    'Chicken', 'Rice', 'Broccoli', 'Pasta', 'Tomato', 
    'Cheese', 'Eggs', 'Bread', 'Milk', 'Potatoes',
    'Carrots', 'Onion', 'Garlic', 'Beef', 'Fish'
  ];

  const addPopularIngredient = (ingredient) => {
    if (!ingredients.includes(ingredient)) {
      const newIngredients = [...ingredients, ingredient];
      setIngredients(newIngredients);
      setUserIngredients(newIngredients);
    }
  };

  const addToMealPlan = (recipe, event) => {
    event.stopPropagation();
    if (onAddToMealPlan) {
      onAddToMealPlan(recipe);
      alert(`"${recipe.title}" added to meal plan! Go to Planner to organize.`);
    }
  };

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
            {recipes.map(recipe => {
              const { hasIngredients, missingIngredients } = analyzeIngredients(recipe, ingredients);
              
              return (
                <div 
                  key={recipe.id} 
                  className="recipe-card"
                  onClick={() => showRecipeDetails(recipe)}
                >
                  <div className="recipe-image">
                    <img src={recipe.image} alt={recipe.title} />
                    <div className="recipe-stats">
                      <span className="used">✅ {hasIngredients.length}</span>
                      <span className="missing">❌ {missingIngredients.length}</span>
                    </div>
                  </div>
                  <div className="recipe-info">
                    <h4>{recipe.title}</h4>
                    
                    {/* Show actual ingredients */}
                    <div className="ingredient-preview">
                      <div className="has-ingredients">
                        <strong>You have:</strong>
                        <div className="ingredient-tags">
                          {hasIngredients.slice(0, 2).map(ing => (
                            <span key={ing.id} className="ingredient-tag has">✓ {ing.name}</span>
                          ))}
                          {hasIngredients.length > 2 && (
                            <span className="ingredient-more">+{hasIngredients.length - 2} more</span>
                          )}
                        </div>
                      </div>
                      <div className="needs-ingredients">
                        <strong>You need:</strong>
                        <div className="ingredient-tags">
                          {missingIngredients.slice(0, 2).map(ing => (
                            <span key={ing.id} className="ingredient-tag needs">+ {ing.name}</span>
                          ))}
                          {missingIngredients.length > 2 && (
                            <span className="ingredient-more">+{missingIngredients.length - 2} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      className="add-to-planner"
                      onClick={(e) => addToMealPlan(recipe, e)}
                    >
                      Add to Meal Plan
                    </button>
                  </div>
                </div>
              );
            })}
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
              <div className="detail-section">
                <h4>Ingredients You Have:</h4>
                <ul>
                  {analyzeIngredients(selectedRecipe, ingredients).hasIngredients.map(ing => (
                    <li key={ing.id}>✓ {ing.original || ing.name}</li>
                  ))}
                  {analyzeIngredients(selectedRecipe, ingredients).hasIngredients.length === 0 && (
                    <li>No matching ingredients</li>
                  )}
                </ul>
              </div>
              
              <div className="detail-section">
                <h4>Ingredients You Need:</h4>
                <ul>
                  {analyzeIngredients(selectedRecipe, ingredients).missingIngredients.map(ing => (
                    <li key={ing.id}>+ {ing.original || ing.name}</li>
                  ))}
                </ul>
              </div>
              
              {selectedRecipe.instructions && (
                <div className="detail-section">
                  <h4>Instructions:</h4>
                  <div 
                    className="instructions" 
                    dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }} 
                  />
                </div>
              )}
            </div>
            
            <button 
              className="add-to-planner-large" 
              onClick={(e) => {
                addToMealPlan(selectedRecipe, e);
                setShowRecipeDetail(false);
              }}
            >
              Add to Meal Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientSearch;