# Fridge2Fork

Smart meal planning from fridge to fork - A React web application that helps reduce food waste by turning your existing ingredients into delicious recipes.

## Features

- **Ingredient Search**: Input ingredients from your fridge, get recipe suggestions with analysis of what you have vs what you need
- **Meal Planner**: Interactive weekly calendar with drag and drop functionality
- **Grocery List**: Automatically generates shopping lists for missing ingredients from your meal plan
- **User Accounts**: Save dietary preferences and allergy information
- **Recipe Details**: Click any recipe card for full instructions and complete ingredient lists
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- Frontend: React, CSS3
- API: Spoonacular Recipe API
- Authentication: Custom auth system
- State Management: React Hooks
- Drag & Drop: HTML5 Native API

## Installation

```bash
# Clone the repository
git clone https://github.com/Alej723/Fridge2Fork.git

# Navigate to project
cd Fridge2Fork

# Install dependencies
npm install

# Start development server
npm start
```

## How to Use
1. Create an account or sign in
2. Add ingredients you have available in your fridge or pantry
3. Search for recipes that use your ingredients
4. Click on any recipe to view detailed instructions and ingredient lists
5. Add recipes to your meal plan
6. Organize your week by dragging recipes to specific days in the meal planner
7. View your grocery list to see missing ingredients from planned meals

## Project Structure
```
src/
├── components/
│   ├── Auth.js          # Login and signup forms
│   ├── IngredientSearch.js # Recipe search functionality
│   ├── MealPlanner.js   # Weekly meal planning with drag & drop
│   ├── GroceryList.js   # Smart grocery list generation
│   ├── Profile.js       # User preferences and account settings
│   └── Navigation.js    # App navigation
├── App.js               # Main application component
└── App.css              # Global styles
```

## Contributors
Alejandro Ramirez & Fariha Kha

## Key Features Implemented
- User authentication system (sign up, login, logout)
- Ingredient-based recipe search using Spoonacular API
- Detailed recipe modal with cooking instructions
- Drag and drop weekly meal planner
- Automatic grocery list generation
- Dietary preferences and allergies management
- Responsive design for all screen sizes