const express = require("express");
const router = express.Router();
const Event = require("../models/event");

// Moment to format dates
const moment = require("moment");

// API to return coordinates from DB
router.get("/v1/getUserCoord", (req, res) => {
  const coordBack = {
    lat: req.user.location.coordinates[0],
    lng: req.user.location.coordinates[1]
  };
  res.json(coordBack);
});

router.post("/v1/events/search", (req, res) => {
  var query = {};
  if (req.body.startDate !== "") {
    query.eventDate = {
      $gte: req.body.startDate
    };
  }
  if (req.body.endDate !== "") {
    query.eventDate = {
      $lte: req.body.endDate
    };
  }
  if (req.body.price !== "") {
    query.price = {
      $lte: parseInt(req.body.price)
    };
  }
  if (req.body.numberPeople !== "") {
    query.numberPeople = {
      $gte: parseInt(req.body.numberPeople)
    };
  }

  Event.find(query, (err) => {
    if (err) {
      throw err;
    }
  }).then(function (events) {
    res.render("events/list", {
      layout: false,
      user: req.user,
      events: events,
      moment
    });
  });
});


module.exports = router;