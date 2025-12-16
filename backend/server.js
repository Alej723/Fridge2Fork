require('dotenv').config();
const app = require('./src/app');

// CRITICAL: Must use process.env.PORT for Render
const PORT = process.env.PORT || 5001;

// Listen on all network interfaces (0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode`);
  console.log(`Listening on port ${PORT}`);
  console.log(`API Health Check: http://localhost:${PORT}/api/health`);
});