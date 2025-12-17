require('dotenv').config();
const axios = require('axios');

console.log('=== CHECKING SPOONACULAR API KEY ===\n');

const apiKey = process.env.SPOONACULAR_API_KEY;

if (!apiKey) {
  console.log('SPOONACULAR_API_KEY is not set in .env file');
  process.exit(1);
}

console.log(`API Key length: ${apiKey.length} characters`);
console.log(`API Key starts with: ${apiKey.substring(0, 8)}...`);

// Test the API key
console.log('\n=== TESTING API CONNECTION ===');

axios.get('https://api.spoonacular.com/recipes/complexSearch', {
  params: {
    apiKey: apiKey,
    query: 'pasta',
    number: 1
  },
  timeout: 10000
})
.then(response => {
  console.log('API Key is VALID!');
  console.log(`Status: ${response.status}`);
  console.log(`Remaining requests: ${response.headers['x-api-quota-used'] || 'N/A'}`);
  process.exit(0);
})
.catch(error => {
  console.log('API Key is INVALID or there is an issue:');
  
  if (error.response) {
    console.log(`Status: ${error.response.status}`);
    console.log(`Error: ${error.response.data.message || error.response.statusText}`);
    
    if (error.response.status === 401) {
      console.log('\nYour API key is invalid. Please get a new one from:');
      console.log('https://spoonacular.com/food-api');
    } else if (error.response.status === 402) {
      console.log('\nAPI quota exceeded. You need to wait or upgrade your plan.');
    }
  } else if (error.request) {
    console.log('No response received. Check your internet connection.');
  } else {
    console.log(`Error: ${error.message}`);
  }
  
  process.exit(1);
});