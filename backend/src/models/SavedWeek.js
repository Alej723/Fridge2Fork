const mongoose = require('mongoose');

const savedWeekSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    default: 'My Week'
  },
  days: {
    sunday: [{
      recipeId: String,
      title: String,
      image: String,
      time: String,
      notes: String,
      addedAt: {
        type: Date,
        default: Date.now
      }
    }],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SavedWeek', savedWeekSchema);