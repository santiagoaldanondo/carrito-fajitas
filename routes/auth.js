const express = require("express");
const router = express.Router();

const passport = require("passport");

// Facebook authentication
router.get("/auth/facebook", passport.authenticate("facebook"));
router.get("/auth/facebook/callback", passport.authenticate("facebook", {
  authType: "reauthenticate",
  successRedirect: "/",
  failureRedirect: "/login"
}));

router.post("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;