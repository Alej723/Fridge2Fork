const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('fridge2fork_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Test authentication on app load
export const checkAuth = async () => {
  const token = localStorage.getItem('fridge2fork_token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) return null;
  
  try {
    const data = await apiRequest('/auth/me');
    return JSON.parse(user);
  } catch (error) {
    // Token is invalid, clear storage
    localStorage.removeItem('fridge2fork_token');
    localStorage.removeItem('user');
    return null;
  }
};