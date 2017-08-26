const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const CATEGORIES = require("../models/food-categories");
require("dotenv").config();

// Moment to format dates
const moment = require("moment");

// GET to show the main events page (with the user events)
router.get("/", (req, res) => {
  Event.find({}, (err) => {
    if (err) {
      throw err;
    }
  }).populate("_creator").sort({
    eventDate: 1
  }).then(function (events) {
    if (events.length === 0) {
      res.render("events", {
        user: req.user
      });
    } else {
      res.render("events/list", {
        user: req.user,
        events: events,
        moment
      });
    }
  });
});

// GET to create a new event
router.get("/new", (req, res) => {
  res.render("events/new", {
    user: req.user,
    categories: CATEGORIES,
    GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY
  });
});

// POST to submit the new event
router.post("/", (req, res) => {

  const newEvent = new Event({
    name: req.body.name,
    eventDate: `${req.body.eventDateDate}T${req.body.eventDateTime}`,
    numberPeople: req.body.numberPeople,
    price: req.body.price,
    category: req.body.category || [],
    address: req.body.address,
    location: {
      type: "Point",
      coordinates: [parseFloat(req.body.latitude), parseFloat(req.body.longitude)]
    },
    _creator: req.user._id,
    numberAssistants: 0
  });

  newEvent.save((err) => {
    if (err) {
      res.render("events/new", {
        user: req.user,
        categories: CATEGORIES,
        GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY,
        messages: {
          error: err
        }
      });
    } else {
      res.redirect("events");
    }
  });
});

// GET to search an event
router.get("/search", (req, res) => {
  res.render("events/search", {
    user: req.user,
    categories: CATEGORIES
  });
});

// GET to show favorite events for the user
router.get("/fav", (req, res) => {
  Event.find({
    _favorites: req.user._id
  }, (err) => {
    if (err) {
      throw err;
    }
  }).populate("_creator").sort({
    eventDate: 1
  }).then(function (events) {
    res.render("events/list", {
      user: req.user,
      events: events,
      moment
    });
  });
});

// Get to show events to which the user wants to assist 
router.get("/assist", (req, res) => {
  Event.find({
    _assistants: req.user._id
  }, (err) => {
    if (err) {
      throw err;
    }
  }).populate("_creator").sort({
    eventDate: 1
  }).then(function (events) {
    res.render("events/list", {
      user: req.user,
      events: events,
      moment
    });
  });
});

// GET to show an event
router.get("/:id", (req, res, next) => {
  const eventId = req.params.id;
  Event.findById(eventId, (err, event) => {
    if (err) {
      return next(err);
    } else {
      res.render("events/show", {
        user: req.user,
        event: event,
        GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY,
        moment
      });
    }
  });
});

// GET to edit an event
router.get("/:id/edit", (req, res, next) => {
  const eventId = req.params.id;
  Event.findById(eventId, (err, event) => {
    if (err) {
      return next(err);
    } else if (event._creator.equals(req.user._id)) { // If it is the creator of the event
      res.render("events/edit", {
        user: req.user,
        event: event,
        categories: CATEGORIES,
        GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY
      });
    } else { // If it is not the creator of the event
      res.redirect("events");
    }
  });
});

// POST to update an event
router.post("/:id", (req, res, next) => {
  const eventId = req.params.id;
  Event.findById(eventId, (err, event) => {
    if (err) {
      return next(err);
    } else if (event._creator.equals(req.user._id)) { // If it is the creator of the event
      const updateEvent = {
        name: req.body.name,
        eventDate: `${req.body.eventDateDate}T${req.body.eventDateTime}`,
        numberPeople: req.body.numberPeople,
        price: req.body.price,
        category: req.body.category || [],
        address: req.body.address,
        location: {
          type: "Point",
          coordinates: [parseFloat(req.body.latitude), parseFloat(req.body.longitude)]
        },
      };
      Event.findByIdAndUpdate(eventId, updateEvent, (err) => {
        if (err) {
          res.render("events/edit", {
            user: req.user,
            event: event,
            categories: CATEGORIES,
            GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY,
            messages: {
              error: err
            }
          });
        } else {
          res.redirect("/events");
        }
      });
    } else {
      res.redirect("/events");
    }
  });
});

module.exports = router;