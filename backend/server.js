require('dotenv').config();
const app = require('./src/app');

// Railway provides PORT environment variable, fallback to 5001 for local
const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode`);
  console.log(`Listening on port ${PORT}`);
  console.log(`API Health Check: http://localhost:${PORT}/api/health`);
});