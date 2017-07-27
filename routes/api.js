const express = require("express");
const router = express.Router();

// API to return coordinates from DB
router.get("/v1/getUserCoord", (req, res, next) => {
  let coordBack = {
    lat: req.user.location.coordinates[0],
    lng: req.user.location.coordinates[1]
  };
  res.json(coordBack);
});

module.exports = router;