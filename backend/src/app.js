const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');
const mealPlanRoutes = require('./routes/mealplans');

// Initialize express
const app = express();

// Connect to database
connectDB();

// Log environment for debugging
console.log('Environment:', process.env.NODE_ENV);
console.log('CORS Origin from env:', process.env.CORS_ORIGIN);

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) {
      console.log('No origin header - allowing request');
      return callback(null, true);
    }
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',           // Local development
      'http://localhost:5001',           // Local development
      'https://fridge2fork.onrender.com', // Production frontend
      'https://fridge2fork-backend.onrender.com' // Production backend (for testing)
    ];
    
    // Add environment variable if set
    if (process.env.CORS_ORIGIN && !allowedOrigins.includes(process.env.CORS_ORIGIN)) {
      allowedOrigins.push(process.env.CORS_ORIGIN);
    }
    
    console.log('CORS check - Origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      console.log('CORS allowed for origin:', origin);
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Authorization']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin || 'none');
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Fridge2Fork API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    cors: {
      allowedOrigins: [
        'http://localhost:3000',
        'http://localhost:5001',
        'https://fridge2fork.onrender.com',
        'https://fridge2fork-backend.onrender.com'
      ]
    }
  });
});

// API status test
app.get('/api/status', (req, res) => {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  res.json({
    backend: 'running',
    database: 'connected',
    spoonacularApi: apiKey ? 'configured' : 'missing',
    apiKeyLength: apiKey ? apiKey.length : 0,
    corsOrigin: process.env.CORS_ORIGIN || 'not set',
    environment: process.env.NODE_ENV,
    originHeader: req.headers.origin || 'none'
  });
});

// Test endpoint with CORS headers
app.get('/api/test-cors', (req, res) => {
  res.json({
    success: true,
    message: 'CORS test successful',
    yourOrigin: req.headers.origin || 'none',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/mealplans', mealPlanRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Handle CORS errors
  if (err.message.includes('CORS')) {
    return res.status(403).json({ 
      success: false,
      error: 'CORS Error',
      message: err.message,
      yourOrigin: req.headers.origin || 'none',
      tip: 'Check if your origin is in the allowed list'
    });
  }
  
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 Route not found:', req.originalUrl);
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    availableEndpoints: [
      '/api/health',
      '/api/status',
      '/api/test-cors',
      '/api/auth/*',
      '/api/users/*',
      '/api/recipes/*',
      '/api/mealplans/*'
    ]
  });
});

module.exports = app;