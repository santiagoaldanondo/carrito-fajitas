const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CATEGORIES = require("./food-categories");

const RecipeSchema = new Schema({}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});
RecipeSchema.add({
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
  category: {
    type: String,
    enum: CATEGORIES,
  },
  difficulty: {
    type: Number,
    min: 0,
    max: 3
  },
  numberPeople: {
    type: Number,
  },
  cookingTime: {
    type: Number
  },
  preparationTime: {
    type: Number
  },
  _creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  _favorites: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  _events: [{
    type: Schema.Types.ObjectId,
    ref: "Event"
  }]
});

RecipeSchema.methods.hasIdInArray = function (id, array) {
  for (let i = 0; i < array.length; i++) {
    if (id.toString() === array[i].toString())
      return i;
  }
  return -1;
};

const Recipe = mongoose.model("Recipe", RecipeSchema);
module.exports = Recipe;