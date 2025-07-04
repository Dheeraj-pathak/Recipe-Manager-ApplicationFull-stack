const mongoose = require('mongoose');

// Define the schema
const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  ingredients: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  image: {
    type: String, // Will store image filename (optional)
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export the model
module.exports = mongoose.model('Recipe', recipeSchema);
