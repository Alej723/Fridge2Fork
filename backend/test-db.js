require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔌 Testing MongoDB connection...');
console.log('URI:', process.env.MONGODB_URI.replace(/:[^:@]*@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI)  // Remove options
  .then(() => {
    console.log('MongoDB connected successfully!');
    console.log('Database:', mongoose.connection.db.databaseName);
    process.exit(0);
  })
  .catch(error => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });