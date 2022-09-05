const passport = require("passport"); // require passport for authentication and authorization
const express = require("express");
const { Router } = require("express");
const router = express.Router();
// const User=require('../models/user/user.model')

// passport.authenticate middleware is used here to authenticate the request
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// The middleware receives the data from Google and runs the function on Strategy config
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://fastmeet-frontend.netlify.app/",
    // successRedirect: "/protected",
    failureFlash: true,
  }),
  async function (req, res) {
    console.log("/google callback", req.user);
    res.redirect("https://fastmeet-frontend.netlify.app/");
  }
);

// Logout route
router.get("/logout", (req, res) => {
  // req.logout(function (err) {
  //   if (err) { return next(err); }
  //   res.redirect('/');
  // });

  req.flash("success", "Successfully logged out");
  req.session.destroy(function () {
    res.clearCookie("connect.sid");
    res.redirect("https://fastmeet-frontend.netlify.app/");
  });
});



module.exports = router;
