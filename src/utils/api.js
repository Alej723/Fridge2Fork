const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('fridge2fork_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
};

// User API
export const userAPI = {
  getProfile: () => apiRequest('/users/profile'),
  
  updatePreferences: (preferences) => apiRequest('/users/preferences', {
    method: 'PUT',
    body: JSON.stringify({ preferences })
  }),
  
  getUserData: () => apiRequest('/users/data'),
  
  updateMealPlan: (mealPlan) => apiRequest('/users/mealplan', {
    method: 'PUT',
    body: JSON.stringify({ mealPlan })
  }),
  
  updateSavedRecipes: (recipes) => apiRequest('/users/recipes', {
    method: 'PUT',
    body: JSON.stringify({ recipes })
  }),
  
  updateIngredients: (ingredients) => apiRequest('/users/ingredients', {
    method: 'PUT',
    body: JSON.stringify({ ingredients })
  }),
  
  toggleFavorite: (recipeId, isFavorite) => 
    apiRequest(`/users/recipes/${recipeId}/favorite`, {
      method: 'PUT',
      body: JSON.stringify({ isFavorite })
    })
};