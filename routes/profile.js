const express = require("express");
const router = express.Router();
const User = require("../models/user");
const CATEGORIES = require("../models/food-categories");
require("dotenv").config();

// GET to show the user's profile
router.get("/", (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId, (err, user) => {
    if (err) {
      throw err;
    }
  }).then(function (user) {
    res.render("profile", {
      user: req.user,
      categories: CATEGORIES,
      GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY
    });
  });
});

// GET to edit the user's profile
router.get("/edit", (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId, (err, user) => {
    if (err) {
      return next(err);
    }
    res.render("profile/edit", {
      user: req.user,
      categories: CATEGORIES,
      GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY
    });
  });
});

// POST to update the user's profile
router.post("/", (req, res, next) => {
  const userId = req.user._id;
  const updates = {
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    familyName: req.body.familyName,
    categories: req.body.categories || [],
    address: req.body.address,
    location: {
      type: "Point",
      coordinates: [parseFloat(req.body.latitude), parseFloat(req.body.longitude)]
    }

  };

  User.findByIdAndUpdate(userId, updates, (err, user) => {
    if (err) {
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

// API to return coordinates from DB
router.get("/getCoord", (req, res, next) => {
  let coordBack = {
    lat: req.user.location.coordinates[0],
    lng: req.user.location.coordinates[1]
  };
  res.json(coordBack);
});

module.exports = router;