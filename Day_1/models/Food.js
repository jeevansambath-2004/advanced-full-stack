// models/Food.js
const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  daysSinceIAte: { type: Number, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Food', FoodSchema);
