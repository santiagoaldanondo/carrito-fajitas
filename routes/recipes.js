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


// GET to show a recipe
router.get("/:id", (req, res, next) => {
  const recipeId = req.params.id;
  console.log("holi");
  Recipe.findById(recipeId, (err, recipe) => {
    if (err) {
      return next(err);
    } else {
      res.render("recipes/show", {
        user: req.user,
        recipe: recipe,
        GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY,
        moment
      });
    }
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
        recipes: recipes,
        categories: CATEGORIES,
        GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY
      });
    } else { // If it is not the creator of the recipe
      res.redirect("recipes");
    }
  });
});

// POST to update arecipe
router.post("/:id", (req, res, next) => {
  const recipeId = req.params.id;
  Recipe.findById(recipeId, (errrecipe) => {
    if (err) {
      return next(err);
    } else if (recipe._creator.equals(req.user._id)) { // If it is the creator of the recipe
      const updateRecipe = {
        name: req.body.name,
        recipeDate: `${req.body.recipeDateDate}T${req.body.recipeDateTime}`,
        numberPeople: req.body.numberPeople,
        price: req.body.price,
        categories: req.body.categories || [],
        address: req.body.address
      };
      Recipe.findByIdAndUpdate(recipeId, updateRecipe, (err) => {
        if (err) {
          res.render("recipes/edit", {
            user: req.user,
            recipe: recipe,
            categories: CATEGORIES,
            GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY,
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
// navScope: "recipe"