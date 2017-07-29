const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const CATEGORIES = require("../models/food-categories");

// GET to show the main events page
router.get("/", (req, res, next) => {
  const userId = req.user._id;
  Event.find({
    _creator: user
  }, (err, events) => {
    if (err) {
      throw err;
    }
  }).then(function (events) {
    res.render("profile", {
      user: req.user,
      categories: CATEGORIES,
      events: events
    });
  });
});

module.exports = router;