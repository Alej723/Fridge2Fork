const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  mealPlan: {
    sunday: [{
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
      addedAt: {
        type: Date,
        default: Date.now
      }
    }],
    monday: Array,
    tuesday: Array,
    wednesday: Array,
    thursday: Array,
    friday: Array,
    saturday: Array
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
mealPlanSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);