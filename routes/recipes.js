const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const CATEGORIES = require("../models/food-categories");
require("dotenv").config();

// GET to show the user's recipes
router.get("/", (req, res) => {
  Recipe.find({
    _creator: req.user._id
  }, (err) => {
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

// GET to create new recipe
router.get("/new", (req, res) => {
  res.render("recipes/new", {
    user: req.user,
    categories: CATEGORIES
  });
});

// POST to save a new recipe
router.post("/", (req, res) => {
  const newRecipe = new Recipe({
    name: req.body.name,
    ingredients: req.body.ingredients,
    directions: req.body.directions,
    category: req.body.category || [],
    difficulty: req.body.difficulty,
    numberPeople: req.body.numberPeople,
    cookingTime: req.body.cookingTime,
    picturePath: req.body.picturePath,
    preparationTime: req.body.preparationTime,
    _creator: req.user._id,
    _favorites: []
  });

  newRecipe.save((err) => {
    if (err) {
      res.render("recipes/new", {
        user: req.user,
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

// GET to search a recipe
router.get("/search", (req, res) => {
  res.render("recipes/search", {
    user: req.user,
    categories: CATEGORIES
  });
});

// Get to show favorite recipes for the user
router.get("/fav", (req, res) => {
  Recipe.find({
    _favorites: req.user._id
  }, (err) => {
    if (err) {
      throw err;
    }
  }).populate("_creator").then(function (recipes) {
    res.render("recipes/list", {
      user: req.user,
      recipes: recipes
    });
  });
});

// GET to show a recipe
router.get("/:id", (req, res, next) => {
  const recipeId = req.params.id;
  Recipe.findById(recipeId, (err, recipe) => {
    if (err) {
      return next(err);
    }
  }).populate("_creator").then(function (recipe) {
    res.render("recipes/show", {
      user: req.user,
      recipe: recipe
    });
  });
});

// GET to edit a recipe
router.get("/:id/edit", (req, res, next) => {
  const recipeId = req.params.id;
  Recipe.findById(recipeId, (err, recipe) => {
    if (err) {
      return next(err);
    } else if (recipe._creator.equals(req.user._id)) { // If it is the creator of the recipe
      res.render("recipes/edit", {
        user: req.user,
        recipe: recipe,
        categories: CATEGORIES
      });
    } else { // If it is not the creator of the recipe
      res.redirect("recipes");
    }
  });
});

// POST to update a recipe
router.post("/:id", (req, res, next) => {
  const recipeId = req.params.id;
  Recipe.findById(recipeId, (err, recipe) => {
    if (err) {
      return next(err);
    } else if (recipe._creator.equals(req.user._id)) { // If it is the creator of the recipe
      const updateRecipe = {
        name: req.body.name,
        picturePath: req.body.picturePath,
        recipeDate: `${req.body.recipeDateDate}T${req.body.recipeDateTime}`,
        numberPeople: req.body.numberPeople,
        price: req.body.price,
        category: req.body.category || [],
        address: req.body.address
      };
      Recipe.findByIdAndUpdate(recipeId, updateRecipe, (err) => {
        if (err) {
          res.render("recipes/edit", {
            user: req.user,
            recipe: recipe,
            categories: CATEGORIES,
            messages: {
              error: err
            }
          });
        } else {
          res.redirect("/recipes");
        }
      });
    } else {
      res.redirect("/recipes");
    }
  });
});

module.exports = router;