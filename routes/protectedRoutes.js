const express = require("express");
const router = express.Router();

// Middleware to check if the user is authenticated
function isUserAuthenticated(req, res, next) {
  console.log(req.user);
  req.user ? next() : res.sendStatus(401);
}

// protected route
router.get("/protected", isUserAuthenticated, (req, res) => {
  console.log("in /protected", req.user);
  res.send("You have reached the protected route");
});
module.exports = router;