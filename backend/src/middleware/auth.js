const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      console.log('Token received:', token ? 'YES' : 'NO');
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded for user ID:', decoded.id);

      // Add userId to request
      req.userId = decoded.id;
      
      // Also add user object if needed
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.error('User not found for ID:', decoded.id);
        return res.status(401).json({ 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      next();
    } catch (error) {
      console.error('Auth error:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token expired', 
          code: 'TOKEN_EXPIRED'
        });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          error: 'Invalid token', 
          code: 'INVALID_TOKEN'
        });
      }
      
      return res.status(401).json({ 
        error: 'Not authorized',
        code: 'AUTH_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ 
      error: 'Not authorized, no token',
      code: 'NO_TOKEN'
    });
  }
};

module.exports = { protect };
