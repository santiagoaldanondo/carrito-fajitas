const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const CATEGORIES = require("../models/food-categories");
require("dotenv").config();

// GET to show the user's recipes
router.get("/", (req, res) => {
  Recipe.find({}, (err) => {
    if (err) {
      throw err;
    }
  }).populate("_creator")
  .then(function (recipes) {
    if (recipes.length === 0) {
      res.render("recipes", {
        user: req.user
      });
    } else {
      res.render("recipes/list", {
        user: req.user,
        recipes: recipes 
      });
    }
  });
});

// Use form to create new recipe
router.get("/new", (req, res, next) => {
  res.render("recipes/new", {
    categories: CATEGORIES
  });
});

router.post("/", (req, res, next) => {
  const userId = req.user._id;
  const newRecipe = new Recipe({
    name: req.body.name,
    ingredients: req.body.ingredients,
    directions: req.body.directions,
    categories: req.body.categories || [],
    difficulty: req.body.difficulty,
    numberPeople: req.body.numberPeople,
    cookingTime: req.body.cookingTime,
    preparationTime: req.body.preparationTime,
    _creator: userId,
    _favorites: []
  });

  newRecipe.save((err) => {
    if (err) {
      res.render("recipes/new", {
        categories: CATEGORIES,
        messages: {
          error: err
        }
      });
    } else {
      res.redirect("recipes");
    }
  });
});

module.exports = router;
// navScope: "recipe"