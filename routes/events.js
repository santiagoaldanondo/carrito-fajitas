const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const CATEGORIES = require("../models/food-categories");
require("dotenv").config();

// Moment to format dates
const moment = require("moment");

// GET to show the main events page
router.get("/", (req, res, next) => {
  const userId = req.user._id;
  Event.find({
    _creator: userId
  }, (err, events) => {
    if (err) {
      throw err;
    }
  }).then(function (events) {
    console.log(events);
    res.render("events", {
      user: req.user,
      categories: CATEGORIES,
      events: events,
      moment
    });
  });
});

// GET to create a new event
router.get("/new", (req, res, next) => {
  res.render("events/new", {
    user: req.user,
    categories: CATEGORIES,
    GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY
  });
});

// POST to submit the new event
router.post("/", (req, res, next) => {
  const userId = req.user._id;
  const newEvent = new Event({
    name: req.body.name,
    eventDate: `${req.body.eventDateDate}T${req.body.eventDateTime}`,
    numberPeople: req.body.numberPeople,
    price: req.body.price,
    categories: req.body.categories || [],
    address: req.body.address,
    location: {
      type: "Point",
      coordinates: [parseFloat(req.body.latitude), parseFloat(req.body.longitude)]
    },
    _creator: userId
  });

  newEvent.save((err) => {
    if (err) {
      res.render("events/new", {
        user: req.user,
        categories: CATEGORIES,
        messages: {
          error: err
        }
      });
    } else {
      res.redirect("events");
    }
  });
});


// // GET to show an event
// router.get("/:id", (req, res, next) => {
//     const eventId = req.params.id;

//     Event.findById(eventId, (err, event) => {
//         if (err) {
//             return next(err);
//         }
//         res.render("events/show", {
//             user: req.user,
//             event: event,
//             moment
//         });
//     });
// });

// // GET to edit an event
// router.get("/:id/edit", (req, res, next) => {
//     if (req.user === ) { // If it has permissions
//         const eventId = req.params.id;

//         event.findById(eventId, (err, event) => {
//             if (err) {
//                 return next(err);
//             }
//             res.render("events/edit", {
//                 user: req.user,
//                 event: event,
//                 moment
//             });
//         });
//     } else {
//         res.redirect(`/${req.params.id}`);
//     }
// });

// // private/events/:id/edit get. Update a event
// router.post("/:id", (req, res, next) => {
//     if (req.user.permissions.eventEdit) { // If it has permissions
//         const eventId = req.params.id;

//         const updates = {
//             name: req.body.name,
//             startingDate: req.body.startingDate,
//             endDate: req.body.endDate,
//             level: req.body.level,
//             available: !!req.body.available
//         };

//         event.findByIdAndUpdate(eventId, updates, (err, event) => {
//             if (err) {
//                 res.render(`events/${eventId}/update`, {
//                     user: req.user,
//                     messages: {
//                         error: err
//                     }
//                 });
//             } else {
//                 res.redirect("/private/events/list");
//             }
//         });
//     } else {
//         res.redirect("/private/events");
//     }
// });




module.exports = router;