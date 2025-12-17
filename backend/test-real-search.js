require('dotenv').config();
const axios = require('axios');

console.log('=== TESTING REAL RECIPE SEARCH ===\n');

const apiKey = process.env.SPOONACULAR_API_KEY;
console.log('API Key:', apiKey ? apiKey.substring(0, 12) + '...' : 'none');

// Test with simple search
axios.post('http://localhost:5001/api/recipes/search', {
  ingredients: ['chicken', 'rice'],
  preferences: {
    dietary: [],
    allergies: [],
    otherAllergies: ''
  }
}, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test' // Use a dummy token
  },
  timeout: 10000
})
.then(response => {
  console.log('✅ Backend search response:');
  console.log('Status:', response.status);
  console.log('Using API:', response.data.usingApi);
  console.log('Message:', response.data.message);
  console.log('Recipe count:', response.data.recipes?.length || 0);
  
  if (response.data.recipes && response.data.recipes.length > 0) {
    console.log('\nFirst recipe:', response.data.recipes[0].title);
    console.log('Has bacon?', JSON.stringify(response.data.recipes[0]).toLowerCase().includes('bacon'));
  }
})
.catch(error => {
  console.log('❌ Error:', error.message);
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Data:', JSON.stringify(error.response.data, null, 2));
  }
});
