const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('Connection string:', process.env.MONGODB_URI.replace(/:[^:@]*@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Successfully connected to MongoDB Atlas!');
  console.log('Database:', mongoose.connection.db.databaseName);
  process.exit(0);
})
.catch((error) => {
  console.error('Connection failed:', error.message);
  process.exit(1);
});