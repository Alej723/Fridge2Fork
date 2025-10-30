import React from 'react';
import './GroceryList.css';

const GroceryList = ({ mealPlan, userIngredients = [] }) => {
  // Extract all ingredients from planned meals
  const getAllNeededIngredients = () => {
    const allIngredients = [];
    const userIngredientLower = userIngredients.map(ing => ing.toLowerCase());
    
    Object.values(mealPlan).forEach(dayRecipes => {
      dayRecipes.forEach(recipe => {
        if (recipe.extendedIngredients) {
          recipe.extendedIngredients.forEach(ingredient => {
            // Check if user already has this ingredient
            const userHasIt = userIngredientLower.some(userIng => 
              ingredient.name.toLowerCase().includes(userIng) || 
              userIng.includes(ingredient.name.toLowerCase())
            );
            
            if (!userHasIt) {
              // Check if we already have this ingredient
              const existingIndex = allIngredients.findIndex(
                item => item.name.toLowerCase() === ingredient.name.toLowerCase()
              );
              
              if (existingIndex >= 0) {
                // Update quantity
                allIngredients[existingIndex].quantity += 1;
              } else {
                // Add new ingredient
                allIngredients.push({
                  name: ingredient.name,
                  quantity: 1,
                  unit: ingredient.unit,
                  original: ingredient.original
                });
              }
            }
          });
        }
      });
    });
    
    return allIngredients;
  };

  const neededIngredients = getAllNeededIngredients();

  // Categorize ingredients
  const categorizeIngredients = (ingredients) => {
    const categories = {
      produce: [],
      dairy: [],
      meat: [],
      pantry: [],
      other: []
    };

    const produceKeywords = ['tomato', 'onion', 'garlic', 'pepper', 'broccoli', 'carrot', 'potato', 'lettuce', 'spinach', 'herb', 'fruit', 'vegetable'];
    const dairyKeywords = ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'egg'];
    const meatKeywords = ['chicken', 'beef', 'pork', 'fish', 'meat', 'bacon', 'sausage'];

    ingredients.forEach(ingredient => {
      const name = ingredient.name.toLowerCase();
      
      if (produceKeywords.some(keyword => name.includes(keyword))) {
        categories.produce.push(ingredient);
      } else if (dairyKeywords.some(keyword => name.includes(keyword))) {
        categories.dairy.push(ingredient);
      } else if (meatKeywords.some(keyword => name.includes(keyword))) {
        categories.meat.push(ingredient);
      } else if (name.includes('oil') || name.includes('flour') || name.includes('sugar') || name.includes('salt') || name.includes('spice')) {
        categories.pantry.push(ingredient);
      } else {
        categories.other.push(ingredient);
      }
    });

    return categories;
  };

  const categorized = categorizeIngredients(neededIngredients);

  return (
    <div className="grocery-list">
      <h2>Grocery List</h2>
      <p>Missing ingredients for your meal plan ({neededIngredients.length} items)</p>
      
      {neededIngredients.length === 0 ? (
        <div className="empty-grocery">
          <p>Your grocery list is empty!</p>
          <p>Add some recipes to your meal plan first.</p>
        </div>
      ) : (
        <div className="grocery-sections">
          {Object.entries(categorized).map(([category, items]) => 
            items.length > 0 && (
              <div key={category} className="grocery-section">
                <h3>{
                  category === 'produce' ? '🥦 Produce' :
                  category === 'dairy' ? '🧀 Dairy' :
                  category === 'meat' ? '🍗 Meat' :
                  category === 'pantry' ? '🍚 Pantry' :
                  '📦 Other'
                }</h3>
                <ul>
                  {items.map((item, index) => (
                    <li key={index}>
                      <input type="checkbox" />
                      <span>
                        {item.quantity > 1 && `${item.quantity}x `}
                        {item.name}
                        {item.unit && item.unit !== '' && ` (${item.original || `${item.quantity} ${item.unit}`})`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      )}
      
      {neededIngredients.length > 0 && (
        <button className="print-btn">Print List</button>
      )}
    </div>
  );
};

export default GroceryList;