const express = require("express");
const router = express.Router();
const User = require("../models/user");
const CATEGORIES = require("../models/food-categories");
require("dotenv").config();

// GET to show the user's recipes
router.get("/", (req, res, next) => {
  const userId = req.user._id;
  User.find({_creator: userId}, (err, user) => {
    if (err) {
      throw err;
    }
  }).then(function (user) {
    res.render("recipe", {
      user: req.user,
      categories: CATEGORIES
    });
  });
});


module.exports = router;
// navScope: "recipe"