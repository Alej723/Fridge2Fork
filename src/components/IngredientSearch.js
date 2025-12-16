import React, { useState } from 'react';
import './IngredientSearch.css';

// Mock recipes data (fallback)
const mockRecipes = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    image: "https://spoonacular.com/recipeImages/1-312x231.jpg",
    readyInMinutes: 30,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    extendedIngredients: [
      { id: 1, name: "spaghetti", original: "200g spaghetti", unit: "g" },
      { id: 2, name: "eggs", original: "2 large eggs", unit: "piece" },
      { id: 3, name: "bacon", original: "100g bacon", unit: "g" },
      { id: 4, name: "parmesan cheese", original: "50g parmesan", unit: "g" },
      { id: 5, name: "garlic", original: "2 cloves garlic", unit: "cloves" }
    ],
    instructions: "1. Cook spaghetti according to package directions. 2. In a bowl, whisk eggs with grated parmesan. 3. Cook bacon until crispy. 4. Combine everything while pasta is hot, mixing quickly to create a creamy sauce. 5. Season with black pepper and serve immediately.",
    usedIngredientCount: 2,
    missedIngredientCount: 3
  },
  {
    id: 2,
    title: "Vegetable Stir Fry",
    image: "https://spoonacular.com/recipeImages/2-312x231.jpg",
    readyInMinutes: 20,
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    dairyFree: true,
    extendedIngredients: [
      { id: 6, name: "broccoli", original: "1 head broccoli", unit: "head" },
      { id: 7, name: "carrots", original: "2 carrots", unit: "piece" },
      { id: 8, name: "bell pepper", original: "1 bell pepper", unit: "piece" },
      { id: 9, name: "soy sauce", original: "2 tbsp soy sauce", unit: "tbsp" },
      { id: 10, name: "garlic", original: "3 cloves garlic", unit: "cloves" },
      { id: 11, name: "ginger", original: "1 tbsp ginger", unit: "tbsp" }
    ],
    instructions: "1. Chop all vegetables into bite-sized pieces. 2. Heat oil in a wok or large pan. 3. Stir-fry vegetables starting with hardest ones first. 4. Add garlic and ginger, then soy sauce. 5. Cook until vegetables are tender-crisp. 6. Serve over rice if desired.",
    usedIngredientCount: 1,
    missedIngredientCount: 5
  },
  {
    id: 3,
    title: "Chicken Salad",
    image: "https://spoonacular.com/recipeImages/3-312x231.jpg",
    readyInMinutes: 15,
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    extendedIngredients: [
      { id: 12, name: "chicken breast", original: "2 chicken breasts", unit: "piece" },
      { id: 13, name: "lettuce", original: "1 head lettuce", unit: "head" },
      { id: 14, name: "tomato", original: "2 tomatoes", unit: "piece" },
      { id: 15, name: "cucumber", original: "1 cucumber", unit: "piece" },
      { id: 16, name: "salad dressing", original: "3 tbsp dressing", unit: "tbsp" }
    ],
    instructions: "1. Grill chicken until cooked through, then slice. 2. Wash and chop lettuce, tomatoes, and cucumber. 3. Combine all ingredients in a large bowl. 4. Add your favorite salad dressing and toss to combine. 5. Serve immediately.",
    usedIngredientCount: 1,
    missedIngredientCount: 4
  },
  {
    id: 4,
    title: "Vegetable Soup",
    image: "https://spoonacular.com/recipeImages/4-312x231.jpg",
    readyInMinutes: 45,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true,
    extendedIngredients: [
      { id: 17, name: "potatoes", original: "3 potatoes", unit: "piece" },
      { id: 18, name: "carrots", original: "2 carrots", unit: "piece" },
      { id: 19, name: "onion", original: "1 onion", unit: "piece" },
      { id: 20, name: "celery", original: "2 stalks celery", unit: "stalks" },
      { id: 21, name: "vegetable broth", original: "1L vegetable broth", unit: "L" }
    ],
    instructions: "1. Chop all vegetables into small pieces. 2. Sauté onions until translucent. 3. Add carrots, celery, and potatoes, cook for 5 minutes. 4. Add vegetable broth and bring to a boil. 5. Reduce heat and simmer for 30 minutes until vegetables are tender. 6. Season with salt and pepper to taste.",
    usedIngredientCount: 0,
    missedIngredientCount: 5
  },
  {
    id: 5,
    title: "Pancakes",
    image: "https://spoonacular.com/recipeImages/5-312x231.jpg",
    readyInMinutes: 20,
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    extendedIngredients: [
      { id: 22, name: "flour", original: "200g flour", unit: "g" },
      { id: 23, name: "milk", original: "250ml milk", unit: "ml" },
      { id: 24, name: "eggs", original: "2 eggs", unit: "piece" },
      { id: 25, name: "sugar", original: "2 tbsp sugar", unit: "tbsp" },
      { id: 26, name: "baking powder", original: "2 tsp baking powder", unit: "tsp" }
    ],
    instructions: "1. Mix dry ingredients in a bowl. 2. In another bowl, whisk milk and eggs. 3. Combine wet and dry ingredients, mix until just combined. 4. Heat a non-stick pan over medium heat. 5. Pour batter onto pan, cook until bubbles form, then flip. 6. Serve with maple syrup or your favorite toppings.",
    usedIngredientCount: 2,
    missedIngredientCount: 3
  },
  {
    id: 6,
    title: "Beef Tacos",
    image: "https://spoonacular.com/recipeImages/6-312x231.jpg",
    readyInMinutes: 25,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    extendedIngredients: [
      { id: 27, name: "ground beef", original: "500g ground beef", unit: "g" },
      { id: 28, name: "taco shells", original: "8 taco shells", unit: "piece" },
      { id: 29, name: "lettuce", original: "1 head lettuce", unit: "head" },
      { id: 30, name: "tomato", original: "2 tomatoes", unit: "piece" },
      { id: 31, name: "cheese", original: "100g shredded cheese", unit: "g" }
    ],
    instructions: "1. Brown the ground beef in a pan, breaking it up as it cooks. 2. Add taco seasoning according to package directions. 3. Warm taco shells according to package instructions. 4. Chop lettuce and tomatoes. 5. Fill taco shells with beef, then top with lettuce, tomatoes, and cheese.",
    usedIngredientCount: 1,
    missedIngredientCount: 4
  },
  {
    id: 7,
    title: "Greek Salad",
    image: "https://spoonacular.com/recipeImages/7-312x231.jpg",
    readyInMinutes: 10,
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    extendedIngredients: [
      { id: 32, name: "cucumber", original: "1 cucumber", unit: "piece" },
      { id: 33, name: "tomato", original: "2 tomatoes", unit: "piece" },
      { id: 34, name: "red onion", original: "1/2 red onion", unit: "piece" },
      { id: 35, name: "olives", original: "1/2 cup olives", unit: "cup" },
      { id: 36, name: "feta cheese", original: "100g feta cheese", unit: "g" }
    ],
    instructions: "1. Chop cucumber, tomatoes, and red onion. 2. Combine in a bowl with olives. 3. Crumble feta cheese over the top. 4. Drizzle with olive oil and lemon juice. 5. Season with oregano, salt, and pepper.",
    usedIngredientCount: 2,
    missedIngredientCount: 3
  },
  {
    id: 8,
    title: "Fried Rice",
    image: "https://spoonacular.com/recipeImages/8-312x231.jpg",
    readyInMinutes: 15,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: true,
    extendedIngredients: [
      { id: 37, name: "rice", original: "2 cups cooked rice", unit: "cups" },
      { id: 38, name: "eggs", original: "2 eggs", unit: "piece" },
      { id: 39, name: "carrots", original: "1 carrot", unit: "piece" },
      { id: 40, name: "peas", original: "1/2 cup peas", unit: "cup" },
      { id: 41, name: "soy sauce", original: "2 tbsp soy sauce", unit: "tbsp" }
    ],
    instructions: "1. Scramble eggs in a hot wok, then set aside. 2. Stir-fry chopped carrots until tender. 3. Add peas and cooked rice. 4. Return eggs to the wok. 5. Add soy sauce and mix well. 6. Cook until heated through.",
    usedIngredientCount: 3,
    missedIngredientCount: 2
  },
  {
    id: 9,
    title: "Falafel Wrap (Halal & Vegan)",
    image: "https://spoonacular.com/recipeImages/9-312x231.jpg",
    readyInMinutes: 25,
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    dairyFree: true,
    extendedIngredients: [
      { id: 42, name: "chickpeas", original: "400g chickpeas", unit: "g" },
      { id: 43, name: "parsley", original: "1 bunch parsley", unit: "bunch" },
      { id: 44, name: "cilantro", original: "1 bunch cilantro", unit: "bunch" },
      { id: 45, name: "cumin", original: "1 tsp cumin", unit: "tsp" },
      { id: 46, name: "pita bread", original: "4 pita breads", unit: "piece" },
      { id: 47, name: "lettuce", original: "1 head lettuce", unit: "head" }
    ],
    instructions: "1. Blend chickpeas with herbs and spices to form a coarse mixture. 2. Form into small patties and fry until golden brown. 3. Warm pita bread. 4. Fill with falafel, lettuce, and your favorite vegetables. 5. Add tahini sauce if desired.",
    usedIngredientCount: 1,
    missedIngredientCount: 5
  },
  {
    id: 10,
    title: "Grilled Chicken with Vegetables (Halal)",
    image: "https://spoonacular.com/recipeImages/10-312x231.jpg",
    readyInMinutes: 35,
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: true,
    extendedIngredients: [
      { id: 48, name: "chicken breast", original: "2 chicken breasts", unit: "piece" },
      { id: 49, name: "bell peppers", original: "2 bell peppers", unit: "piece" },
      { id: 50, name: "zucchini", original: "1 zucchini", unit: "piece" },
      { id: 51, name: "olive oil", original: "2 tbsp olive oil", unit: "tbsp" },
      { id: 52, name: "lemon juice", original: "2 tbsp lemon juice", unit: "tbsp" },
      { id: 53, name: "oregano", original: "1 tsp oregano", unit: "tsp" }
    ],
    instructions: "1. Marinate chicken in olive oil, lemon juice, and oregano for 30 minutes. 2. Chop vegetables into large pieces. 3. Grill chicken for 6-8 minutes per side until cooked through. 4. Grill vegetables until tender with grill marks. 5. Serve chicken with grilled vegetables.",
    usedIngredientCount: 1,
    missedIngredientCount: 5
  }
];

const IngredientSearch = ({ onAddToMealPlan, setUserIngredients, userPreferences }) => {
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeDetail, setShowRecipeDetail] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  const filterRecipesByPreferences = (recipesToFilter) => {
    if (!userPreferences || (userPreferences.dietary.length === 0 && userPreferences.allergies.length === 0 && !userPreferences.otherAllergies)) {
      return recipesToFilter;
    }

    return recipesToFilter.filter(recipe => {
      // Check dietary restrictions
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

      // Check for Halal (no pork, alcohol)
      if (userPreferences.dietary.includes('Halal')) {
        const nonHalalKeywords = ['pork', 'bacon', 'ham', 'gelatin', 'alcohol', 'wine', 'beer', 'lard'];
        const recipeText = (recipe.title + ' ' + recipe.extendedIngredients?.map(ing => ing.name).join(' ')).toLowerCase();
        
        if (nonHalalKeywords.some(keyword => recipeText.includes(keyword))) {
          return false;
        }
      }

      // Check for Kosher (no pork, shellfish mixing meat/dairy)
      if (userPreferences.dietary.includes('Kosher')) {
        const nonKosherKeywords = ['pork', 'shellfish', 'shrimp', 'crab', 'lobster'];
        const hasMeat = ['beef', 'chicken', 'lamb', 'meat'].some(meat => 
          recipe.extendedIngredients?.some(ing => ing.name.toLowerCase().includes(meat))
        );
        const hasDairy = ['cheese', 'milk', 'butter', 'cream'].some(dairy => 
          recipe.extendedIngredients?.some(ing => ing.name.toLowerCase().includes(dairy))
        );
        
        const recipeText = (recipe.title + ' ' + recipe.extendedIngredients?.map(ing => ing.name).join(' ')).toLowerCase();
        
        if (nonKosherKeywords.some(keyword => recipeText.includes(keyword)) || (hasMeat && hasDairy)) {
          return false;
        }
      }

      // Check allergies
      const allIngredients = recipe.extendedIngredients
        ?.map(ing => ing.name?.toLowerCase() || '')
        .join(' ') || '';
      
      const recipeTitle = recipe.title?.toLowerCase() || '';
      const fullRecipeText = `${allIngredients} ${recipeTitle}`;

      const allergenKeywords = {
        'Nuts': ['nut', 'almond', 'walnut', 'pecan', 'cashew', 'pistachio', 'hazelnut', 'peanut', 'peanut butter'],
        'Shellfish': ['shrimp', 'crab', 'lobster', 'shellfish', 'prawn', 'crawfish', 'crayfish'],
        'Eggs': ['egg', 'mayonnaise', 'mayo'],
        'Soy': ['soy', 'tofu', 'edamame', 'soybean', 'soya'],
        'Wheat': ['wheat', 'flour', 'bread', 'pasta', 'noodles'],
        'Fish': ['fish', 'salmon', 'tuna', 'cod', 'tilapia', 'trout', 'anchovy']
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
      // Try to use backend API first
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      const token = localStorage.getItem('fridge2fork_token');
      
      console.log('Searching with ingredients:', ingredients);
      console.log('Using preferences:', userPreferences);
      
      const response = await fetch(`${apiUrl}/recipes/search`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          ingredients,
          preferences: userPreferences || {
            dietary: [],
            allergies: [],
            otherAllergies: ''
          }
        })
      });

      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        throw new Error('Invalid response from server');
      }

      if (response.ok && data.success) {
        console.log('Got recipes from backend:', data.recipes?.length || 0);
        setRecipes(data.recipes || []);
        setUsingMockData(!data.usingApi);
        
        if (data.message) {
          console.log('Server message:', data.message);
        }
        
        if ((data.recipes || []).length === 0) {
          alert('No recipes found matching your ingredients and preferences.');
        }
      } else {
        throw new Error(data.error || 'Failed to fetch recipes');
      }
      
    } catch (error) {
      console.error('Error fetching recipes from backend:', error);
      
      // Fallback to local mock data
      console.log('Falling back to mock data...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userIngredientLower = ingredients.map(ing => ing.toLowerCase());
      
      // Calculate matching mock recipes
      const matchedRecipes = mockRecipes.map(recipe => {
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
        
        return {
          ...recipe,
          usedIngredientCount: hasIngredients.length,
          missedIngredientCount: missingIngredients.length,
          hasIngredients,
          missingIngredients
        };
      });
      
      // Sort by most matching ingredients first
      const sortedRecipes = matchedRecipes
        .sort((a, b) => b.usedIngredientCount - a.usedIngredientCount)
        .slice(0, 6);
      
      const filteredRecipes = filterRecipesByPreferences(sortedRecipes);
      setRecipes(filteredRecipes);
      setUsingMockData(true);
      
      console.log('Using mock data, found:', filteredRecipes.length, 'recipes');
      
      if (error.message && !error.message.includes('Invalid response')) {
        alert('Using demo recipes. Check your connection for real recipes.');
      }
      
      if (filteredRecipes.length === 0) {
        alert('No recipes found matching your ingredients and preferences.');
      }
    }
    
    setLoading(false);
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
        {usingMockData && (
          <p className="demo-notice" style={{
            color: '#666', 
            fontSize: '0.9rem', 
            marginTop: '0.5rem',
            backgroundColor: '#fff3cd',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ffeaa7'
          }}>
            <strong>⚠️ Demo Mode:</strong> Using sample recipes
          </p>
        )}
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
          <h3>
            Found {recipes.length} Recipes 
            {usingMockData && <span style={{fontSize: '0.8rem', color: '#666', marginLeft: '10px'}}>(Demo Data)</span>}
          </h3>
          <div className="recipe-grid">
            {recipes.map(recipe => {
              const { hasIngredients, missingIngredients } = analyzeIngredients(recipe, ingredients);
              
              return (
                <div 
                  key={recipe.id} 
                  className="recipe-card"
                  style={{ position: 'relative' }}
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
                  <div className="instructions">
                    {selectedRecipe.instructions.split('\n').map((step, index) => (
                      <p key={index}>{step}</p>
                    ))}
                  </div>
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