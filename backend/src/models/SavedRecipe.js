const mongoose = require('mongoose');

const savedRecipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipeId: String,
  title: String,
  image: String,
  readyInMinutes: Number,
  extendedIngredients: [{
    name: String,
    original: String,
    unit: String
  }],
  instructions: String,
  vegetarian: Boolean,
  vegan: Boolean,
  glutenFree: Boolean,
  dairyFree: Boolean,
  savedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SavedRecipe', savedRecipeSchema);