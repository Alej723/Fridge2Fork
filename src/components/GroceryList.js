import React from 'react';
import './GroceryList.css';

const GroceryList = () => {
  // Sample data - we'll generate this from meal planner later
  const groceryItems = [
    { category: 'Produce', items: ['Broccoli', 'Tomatoes', 'Bell Peppers'] },
    { category: 'Dairy', items: ['Milk', 'Cheese', 'Yogurt'] },
    { category: 'Meat', items: ['Chicken Breast', 'Ground Beef'] },
    { category: 'Pantry', items: ['Pasta', 'Rice', 'Olive Oil'] }
  ];

  return (
    <div className="grocery-list">
      <h2>Grocery List</h2>
      <p>Generated from your meal plan</p>
      
      <div className="grocery-sections">
        {groceryItems.map((section, index) => (
          <div key={index} className="grocery-section">
            <h3>🥦 {section.category}</h3>
            <ul>
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <input type="checkbox" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <button className="print-btn">Print List</button>
    </div>
  );
};

export default GroceryList;