require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=== FRIDGE2FORK BACKEND ===`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Listening on: http://localhost:${PORT}`);
  console.log(`API Health: http://localhost:${PORT}/api/health`);
  console.log(`API Status: http://localhost:${PORT}/api/status`);
  console.log(`===========================\n`);
  
  // Log API key status
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (apiKey && apiKey.length > 20) {
    console.log('Spoonacular API key is configured');
  } else {
    console.log('Spoonacular API key is missing or invalid');
    console.log('   Using demo mode for recipe search');
  }
});