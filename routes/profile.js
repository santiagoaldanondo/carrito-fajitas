const express = require("express");
const router = express.Router();
const User = require("../models/user");
const CATEGORIES = require("../models/food-categories");
const multer = require("multer"); // Used to manage uploaded files
require("dotenv").config();

const upload = multer({
  dest: process.env.UPLOAD_PATH
}); //Set the path for the uploaded files to be saved

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
router.post("/", upload.single("picturePath"), (req, res, next) => {
  const userId = req.user._id;
  const picturePath = req.file.filename ? process.env.UPLOAD_PATH + req.file.filename : null;
  const updates = {
    username: req.body.username,
    categories: req.body.categories || [],
    address: req.body.address,
    picturePath: req.body.picturePath,
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

module.exports = router;