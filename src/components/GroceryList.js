import React, { useRef } from 'react';
import './GroceryList.css';

const GroceryList = ({ mealPlan, userIngredients = [] }) => {
  const componentRef = useRef();

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

    const produceKeywords = ['tomato', 'onion', 'garlic', 'pepper', 'broccoli', 'carrot', 'potato', 'lettuce', 'spinach', 'herb', 'fruit', 'vegetable', 'cucumber', 'celery', 'ginger', 'avocado', 'lemon', 'lime', 'apple', 'banana', 'berry', 'orange', 'grape'];
    const dairyKeywords = ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'egg', 'parmesan', 'feta', 'cheddar', 'mozzarella', 'yoghurt', 'sour cream'];
    const meatKeywords = ['chicken', 'beef', 'pork', 'fish', 'meat', 'bacon', 'sausage', 'ham', 'turkey', 'lamb', 'shrimp', 'salmon', 'tuna', 'cod'];

    ingredients.forEach(ingredient => {
      const name = ingredient.name.toLowerCase();
      
      if (produceKeywords.some(keyword => name.includes(keyword))) {
        categories.produce.push(ingredient);
      } else if (dairyKeywords.some(keyword => name.includes(keyword))) {
        categories.dairy.push(ingredient);
      } else if (meatKeywords.some(keyword => name.includes(keyword))) {
        categories.meat.push(ingredient);
      } else if (name.includes('oil') || name.includes('flour') || name.includes('sugar') || name.includes('salt') || name.includes('spice') || name.includes('rice') || name.includes('pasta') || name.includes('bean') || name.includes('nut') || name.includes('seed') || name.includes('vinegar') || name.includes('sauce') || name.includes('broth') || name.includes('cereal') || name.includes('oat')) {
        categories.pantry.push(ingredient);
      } else {
        categories.other.push(ingredient);
      }
    });

    return categories;
  };

  const categorized = categorizeIngredients(neededIngredients);
  
  // Calculate total items
  const totalItems = neededIngredients.reduce((sum, item) => sum + item.quantity, 0);
  
  // Format date for print
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Handle print
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Fridge2Fork Grocery List</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .print-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #4CAF50;
              padding-bottom: 20px;
            }
            .print-header h1 {
              color: #4CAF50;
              margin-bottom: 10px;
            }
            .print-meta {
              display: flex;
              justify-content: space-between;
              color: #666;
              margin-top: 20px;
            }
            .category-section {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            .category-title {
              background: #f5f5f5;
              padding: 10px 15px;
              border-radius: 5px;
              margin-bottom: 15px;
              font-size: 18px;
              font-weight: bold;
            }
            .ingredient-list {
              list-style: none;
              padding-left: 0;
            }
            .ingredient-item {
              padding: 8px 0;
              border-bottom: 1px solid #eee;
              display: flex;
              align-items: center;
            }
            .checkbox {
              width: 20px;
              height: 20px;
              margin-right: 10px;
              border: 1px solid #ccc;
              border-radius: 3px;
            }
            .quantity {
              font-weight: bold;
              margin-right: 5px;
              min-width: 40px;
            }
            .ingredient-name {
              flex: 1;
            }
            .unit {
              color: #666;
              font-size: 0.9em;
              margin-left: 10px;
            }
            .empty-state {
              text-align: center;
              color: #999;
              padding: 40px;
              font-style: italic;
            }
            .print-footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              text-align: center;
              color: #999;
              font-size: 0.9em;
            }
            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Fridge2Fork Grocery List</h1>
            <p>Your smart shopping companion</p>
            <div class="print-meta">
              <div>Date: ${currentDate}</div>
              <div>Total Items: ${totalItems}</div>
            </div>
          </div>
          
          ${neededIngredients.length === 0 ? `
            <div class="empty-state">
              <h3>Your grocery list is empty!</h3>
              <p>Add some recipes to your meal plan first.</p>
            </div>
          ` : `
            ${Object.entries(categorized).map(([category, items]) => 
              items.length > 0 ? `
                <div class="category-section">
                  <div class="category-title">${
                    category === 'produce' ? 'Produce' :
                    category === 'dairy' ? 'Dairy' :
                    category === 'meat' ? 'Meat' :
                    category === 'pantry' ? 'Pantry' :
                    'Other'
                  } (${items.reduce((sum, item) => sum + item.quantity, 0)} items)</div>
                  <ul class="ingredient-list">
                    ${items.map((item, index) => `
                      <li class="ingredient-item">
                        <div class="checkbox"></div>
                        <span class="quantity">${item.quantity > 1 ? `${item.quantity}x` : ''}</span>
                        <span class="ingredient-name">${item.name}</span>
                        ${item.unit && item.unit !== '' ? `<span class="unit">${item.original || `${item.quantity} ${item.unit}`}</span>` : ''}
                      </li>
                    `).join('')}
                  </ul>
                </div>
              ` : ''
            ).join('')}
          `}
          
          <div class="print-footer">
            <p>Generated by Fridge2Fork • Smart meal planning from fridge to fork</p>
            <p>Check off items as you shop to stay organized!</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Handle download as text
  const handleDownloadText = () => {
    const textContent = `Fridge2Fork Grocery List\nGenerated: ${currentDate}\nTotal Items: ${totalItems}\n\n` +
      Object.entries(categorized).map(([category, items]) => 
        items.length > 0 ? 
          `${category === 'produce' ? 'Produce' :
            category === 'dairy' ? 'Dairy' :
            category === 'meat' ? 'Meat' :
            category === 'pantry' ? 'Pantry' :
            'Other'}:\n` +
          items.map(item => 
            `[ ] ${item.quantity > 1 ? `${item.quantity}x ` : ''}${item.name}${item.unit ? ` (${item.original || `${item.quantity} ${item.unit}`})` : ''}`
          ).join('\n') + '\n'
        : ''
      ).join('\n');
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fridge2fork-grocery-list-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grocery-list">
      <h2>Grocery List</h2>
      <p>Missing ingredients for your meal plan ({totalItems} items)</p>
      
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
                  category === 'produce' ? 'Produce' :
                  category === 'dairy' ? 'Dairy' :
                  category === 'meat' ? 'Meat' :
                  category === 'pantry' ? 'Pantry' :
                  'Other'
                } <span className="item-count">({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span></h3>
                <ul>
                  {items.map((item, index) => (
                    <li key={index} className="ingredient-item">
                      <input type="checkbox" className="grocery-checkbox" />
                      <span className="ingredient-text">
                        {item.quantity > 1 && <span className="quantity-badge">{item.quantity}x</span>}
                        <span className="ingredient-name">{item.name}</span>
                        {item.unit && item.unit !== '' && (
                          <span className="ingredient-details">
                            {item.original || `${item.quantity} ${item.unit}`}
                          </span>
                        )}
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
        <div className="action-buttons">
          <button className="print-btn" onClick={handlePrint}>
            Print List
          </button>
          <button 
            className="print-btn secondary" 
            onClick={handleDownloadText}
          >
            Download as Text
          </button>
        </div>
      )}
    </div>
  );
};

export default GroceryList;