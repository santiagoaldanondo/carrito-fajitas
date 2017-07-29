const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CATEGORIES = require("./food-categories");

const RecipeSchema = new Schema({
  name: {
    type: String,
    required: [true, "You need a name for your recipe"]
  },
  ingredients: {
    type: String,
    required: [true, "You need to add some ingredients"]
  },
  directions: {
    type: String,
    required: [true, "You need directions for your recipe"]
  },
  categories: [{
    type: String,
    enum: CATEGORIES,
    required: true
  }],
  difficulty: {
    type: Number,
    min: 1,
    max: 3
  },
  numberPeople: {
    type: Number,
    required: true
  },
  cookingTime: {
    type: Date
  },
  preparationTime: {
    type: Date
  },
  _creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  _favorites: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  _events: [{
    type: Schema.Types.ObjectId,
    ref: "Event"
  }]
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Recipe = mongoose.model("Recipe", RecipeSchema);
module.exports = Recipe;
