# Fridge2Fork - Smart Meal Planning from Fridge to Fork

> **Reduce food waste, save time, and eat better with meal planning powered by Spoonacular**

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

**Fridge2Fork** is a full-stack web application designed to revolutionize meal planning by helping users reduce food waste, save money, and simplify cooking. The app intelligently generates recipes based on ingredients you already have, creates personalized weekly meal plans, and automatically generates organized grocery lists for missing ingredients.

### Mission
Our mission is to combat food waste (estimated at 30-40% of the US food supply) and reduce the stress of meal planning by creating an intuitive, intelligent tool that makes cooking at home easier, more sustainable, and more enjoyable.

## Key Features

### 1. **Ingredient-Based Recipe Search**
- Enter ingredients from your fridge/pantry
- Get recipe suggestions using available ingredients
- Filter by dietary preferences & allergies
- Real-time API integration with Spoonacular + demo mode

### 2. **Interactive Weekly Meal Planner**
- Drag-and-drop recipe planning
- Visual weekly calendar view
- Save favorite meal plans for later
- Mobile-responsive design

### 3. **Smart Grocery List Generator**
- Automatically identifies missing ingredients
- Organizes items by category (produce, dairy, etc.)
- Printable/downloadable lists
- Check-off functionality

### 4. **User Personalization**
- Dietary preferences (Vegetarian, Vegan, Halal, Kosher, etc.)
- Allergy tracking
- Account-based data persistence
- Cloud-sync across devices

### 5. **Demo Mode**
- Works without API keys
- 12+ sample recipes for testing
- Realistic ingredient matching

## Tech Stack

### **Frontend**
- **React** - UI framework
- **CSS3** - Custom styling with responsive design
- **React Router** - Navigation
- **LocalStorage** - Client-side persistence
- **Drag-and-Drop** - Native HTML5

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database & ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

### **External APIs**
- **Spoonacular API** - Recipe database
- **Caching** - In-memory caching for performance

### **DevOps**
- **Environment Variables** - Secure configuration
- **CORS** - Cross-origin resource sharing
- **Render** - Deployment platform

## Project Structure
```text
fridge2fork/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js    # User auth logic
│   │   │   ├── mealPlanController.js # Meal plan CRUD
│   │   │   └── userController.js    # User preferences
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT authentication
│   │   ├── models/
│   │   │   ├── MealPlan.js          # Meal plan schema
│   │   │   ├── SavedRecipe.js       # Saved recipes schema
│   │   │   ├── SavedWeek.js         # Weekly meal plan saves
│   │   │   └── User.js              # User schema with preferences
│   │   ├── routes/
│   │   │   ├── auth.js              # Auth endpoints
│   │   │   ├── mealplans.js         # Meal plan endpoints
│   │   │   ├── recipes.js           # Recipe search endpoints
│   │   │   └── users.js             # User endpoints
│   │   └── app.js                   # Express app configuration
│   ├── server.js                    # Server entry point
│   ├── createDemoUser.js            # Demo user setup
│   └── MockRecipes.js              # Sample recipe data
├── src/
│   ├── components/
│   │   ├── Auth.js                  # Login/Register component
│   │   ├── IngredientSearch.js      # Recipe search interface
│   │   ├── MealPlanner.js           # Weekly planning interface
│   │   ├── GroceryList.js           # Shopping list generator
│   │   ├── Profile.js               # User preferences
│   │   ├── SavedWeeks.js            # Saved meal plans
│   │   ├── Navigation.js            # Site navigation
│   │   └── LoadingSpinner.js        # Loading indicators
│   ├── utils/
│   │   └── api.js                   # API helper functions
│   └── App.js                       # Main application component
├── public/
│   └── index.html                   # HTML template
└── package.json                     # Dependencies
```
## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
# Clone the repository
git clone <repository-url>
cd fridge2fork/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configurations
# Add MongoDB URI and JWT secret

# Start development server
npm run dev
```

### Frontend Setup
```bash
cd ../src

# Install dependencies
npm install

# Start React development server
npm start
```

## Configuration
### Environment Variables (.env)
```bash
# Backend
MONGODB_URI=mongodb_connection_string
JWT_SECRET=jwt_secret_key
JWT_EXPIRE=7d
PORT=5001
NODE_ENV=production

# Spoonacular API
SPOONACULAR_API_KEY=api_key
CORS_ORIGIN=http://localhost:3000
```

## Frontend Configuration
```javascript
// In src/App.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
```

## API Documentation
### Authentication
```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```
### Recipes
```http
POST /api/recipes/search
Body: { ingredients: ["chicken", "rice"], preferences: {...} }
```

### Meal Plans
```http
GET    /api/mealplans/current
PUT    /api/mealplans
POST   /api/mealplans/save-week
GET    /api/mealplans/saved-weeks
GET    /api/mealplans/saved-weeks/:id
```

### Users
```http
GET  /api/users/profile
PUT  /api/users/preferences
```

## Frontend Components

### `IngredientSearch.js`
Main interface for finding recipes based on available ingredients:
- Ingredient input with auto-suggest
- Popular ingredient quick-add
- Recipe cards with ingredient matching
- Filter by dietary preferences

### `MealPlanner.js`
Weekly planning interface:
- Drag-and-drop recipe assignment
- Day-by-day organization
- Save weeks to favorites
- Visual recipe cards

### `GroceryList.js`
Smart shopping list generator:
- Automatically detects missing ingredients
- Categorizes by food type
- Printable/downloadable format
- Check-off capability

### `Profile.js`
User settings and preferences:
- Dietary restriction selection
- Allergy management
- Account information

## Deployment

### Backend (Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy with `npm start`

### Frontend (Render)
1. Build with `npm run build`
2. Deploy static files
3. Set environment variables

### MongoDB (Atlas)
1. Create free cluster
2. Whitelist IP addresses
3. Get connection string
4. Add to environment variables

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting

## Team
- **Fariha Kha** - Backend & Database
- **Alejandro Moya Ramirez** - Frontend & UI/UX
- **Project Course** - CSCI 39548 - Practical Web Development w/ Professor Kwame Baffour

**Happy Cooking!**
