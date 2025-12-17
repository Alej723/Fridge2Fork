require('dotenv').config();
const axios = require('axios');

console.log('=== TESTING NEW SPOONACULAR API KEY ===\n');

const apiKey = process.env.SPOONACULAR_API_KEY;

if (!apiKey) {
  console.log('❌ SPOONACULAR_API_KEY is not set in .env file');
  process.exit(1);
}

console.log(`API Key: ${apiKey.substring(0, 12)}...`);
console.log(`Key length: ${apiKey.length} characters`);

// Test with a simple search
axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
  params: {
    ingredients: 'chicken,rice',
    number: 1,
    apiKey: apiKey,
    ranking: 2
  },
  timeout: 10000
})
.then(response => {
  console.log('\n✅ API Key is WORKING!');
  console.log(`Status: ${response.status}`);
  console.log(`Found ${response.data.length} recipes`);
  console.log(`First recipe: ${response.data[0]?.title || 'none'}`);
  
  // Check quota headers if available
  if (response.headers['x-api-quota-used']) {
    console.log(`Quota used: ${response.headers['x-api-quota-used']}`);
  }
  if (response.headers['x-api-quota-left']) {
    console.log(`Quota left: ${response.headers['x-api-quota-left']}`);
  }
  
  process.exit(0);
})
.catch(error => {
  console.log('\n❌ API Key test FAILED:');
  
  if (error.response) {
    console.log(`Status: ${error.response.status}`);
    console.log(`Error: ${JSON.stringify(error.response.data, null, 2)}`);
    
    if (error.response.status === 402) {
      console.log('\n⚠️  This account has NO quota left. You might need to:');
      console.log('1. Wait until tomorrow (quota resets at midnight UTC)');
      console.log('2. Use a DIFFERENT email to create a new account');
      console.log('3. Check if you need to verify your email first');
    }
  } else if (error.request) {
    console.log('No response received. Check your internet connection.');
  } else {
    console.log(`Error: ${error.message}`);
  }
  
  process.exit(1);
});