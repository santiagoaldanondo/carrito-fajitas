const express = require("express");
const router = express.Router();
const User = require("../models/user");
const CATEGORIES = require("../models/food-categories");

router.get("/", (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId, (err, user) => {
    if (err) {
      throw err;
    }
  }).then(function (user) {
    res.render("profile", {
      user: req.user,
      categories: CATEGORIES
    });
  });
});

router.get("/edit", (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId, (err, user) => {
    if (err) {
      return next(err);
    }
    console.log(user);
    res.render("profile/edit", {
      user: req.user,
      categories: CATEGORIES
    });
  });
});

router.post("/", (req, res, next) => {
  const userId = req.user._id;
  const updates = {
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    familyName: req.body.familyName,
    categories: req.body.categories,
    location: {
      type: "Point",
      coordinates: [parseInt(req.body.latitude), parseInt(req.body.longitude)]
    }

  };

  User.findByIdAndUpdate(userId, updates, (err, user) => {
    if (err) {
      console.log(err);
      console.log(updates);
      return res.render("profile/edit", {
        user: req.user,
        categories: CATEGORIES,
        messages: {
          error: err
        }
      });
    } else {
      res.redirect("/profile");
    }
  });
});

module.exports = router;