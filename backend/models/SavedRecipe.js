const mongoose = require('mongoose');

const savedRecipeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  recipes: [{
    id: Number,
    title: String,
    image: String,
    readyInMinutes: Number,
    extendedIngredients: [{
      id: Number,
      name: String,
      original: String,
      unit: String
    }],
    vegetarian: Boolean,
    vegan: Boolean,
    glutenFree: Boolean,
    dairyFree: Boolean,
    instructions: String,
    savedAt: {
      type: Date,
      default: Date.now
    },
    isFavorite: {
      type: Boolean,
      default: false
    }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SavedRecipe', savedRecipeSchema);