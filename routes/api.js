const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const Recipe = require("../models/recipe");

const aws = require("aws-sdk");
const S3_BUCKET = process.env.S3_BUCKET;

const crypto = require("crypto");

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

// API to search recipes
router.post("/v1/recipes/search", (req, res) => {
  var query = {};
  if (req.body.name !== "") {
    query.name = new RegExp(req.body.name, "i");
  }
  if (req.body.ingredients !== "") {
    query.ingredients = new RegExp(req.body.ingredients, "i");
  }
  if (req.body.difficulty !== "") {
    query.difficulty = parseInt(req.body.difficulty);
  }
  if (req.body.numberPeople !== "") {
    query.numberPeople = {
      $gte: parseInt(req.body.numberPeople)
    };
  }
  if (req.body.category !== "") {
    query.category = req.body.category;
  }

  Recipe.find(query, (err) => {
    if (err) {
      throw err;
    }
  }).populate("_creator").then(function (recipes) {
    res.render("recipes/list", {
      layout: false,
      user: req.user,
      recipes: recipes
    });
  });
});

// API to search events
router.post("/v1/events/search", (req, res) => {
  var query = {};
  var maxdistance = req.body.distance * 1000 || 50000;
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
  if (req.body.category !== "") {
    query.category = req.body.category;
  }
  if (req.body.address !== "") {
    query.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(req.body.latitude), parseFloat(req.body.longitude)]
        },
        $maxDistance: maxdistance
      }
    };
  }

  Event.find(query, (err) => {
    if (err) {
      throw err;
    }
  }).populate("_creator").populate("_assistants").populate("_recipes").sort({
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

// API to toggle favorites from recipes
router.post("/v1/recipes/toggleFav", (req, res, next) => {
  var itemId = req.body.itemId;
  Recipe.findById(itemId, (err, recipe) => {
    if (err) {
      return next(err);
    } else {
      var index = recipe.hasIdInArray(req.user._id, recipe._favorites);
      if (index > -1)
        recipe._favorites.splice(index, 1);
      else
        recipe._favorites.push(req.user._id);
    }
    recipe.save((err) => {
      if (err) {
        return next(err);
      } else {
        res.json({});
      }
    });
  });
});

// API to toggle favorites from events
router.post("/v1/events/toggleFav", (req, res, next) => {
  var itemId = req.body.itemId;
  Event.findById(itemId, (err, event) => {
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

// API to toggle assistants from events
router.post("/v1/events/toggleAssist", (req, res, next) => {
  var itemId = req.body.itemId;
  Event.findById(itemId, (err, event) => {
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
        res.json(event);
      }
    });
  });
});

// API to sign with S3
router.get("/v1/sign-s3", (req, res) => {
  const s3 = new aws.S3();
  const fileType = req.query["file-type"];
  const fileName = crypto.randomBytes(10).toString("hex") + fileType.replace("image/", ".");
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: "public-read"
  };

  s3.getSignedUrl("putObject", s3Params, (err, data) => {
    if (err) {
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

// API to show a list with the selected recipes
router.post("/v1/getRecipesForEvent", (req, res) => {
  const recipeIds = [];
  Object.keys(req.body).forEach(function (key) {
    recipeIds.push(req.body[key]);
  });
  Recipe.find({
    "_id": {
      $in: recipeIds
    }
  },
  (err) => {
    if (err) {
      throw err;
    }
  }).then(function (recipes) {
    res.render("recipes/list", {
      layout: false,
      user: req.user,
      recipes: recipes
    });
  });
});

module.exports = router;