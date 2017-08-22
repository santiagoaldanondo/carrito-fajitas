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
  }).populate("_creator").sort({
    eventDate: 1
  }).then(function (events) {
    res.render("events/list", {
      layout: false,
      user: req.user,
      events: events,
      moment
    });
  });
});

router.post("/v1/events/toggleFav", (req, res, next) => {
  var eventId = req.body.eventId;
  Event.findById(eventId, (err, event) => {
    if (err) {
      return next(err);
    } else {
      var index = event.hasIdInArray(req.user._id, event._favorites);
      if (index > -1)
        event._favorites.splice(index, 1);
      else
        event._favorites.push(req.user._id);
    }
    event.save((err) => {
      if (err) {
        return next(err);
      } else {
        res.json({});
      }
    });
  });
});

router.post("/v1/events/toggleAssist", (req, res, next) => {
  var eventId = req.body.eventId;
  Event.findById(eventId, (err, event) => {
    if (err) {
      return next(err);
    } else {
      var index = event.hasIdInArray(req.user._id, event._assistants);
      if (index > -1)
        event._assistants.splice(index, 1);
      else
        event._assistants.push(req.user._id);
    }
    event.save((err) => {
      if (err) {
        return next(err);
      } else {
        res.json({});
      }
    });
  });
});



module.exports = router;