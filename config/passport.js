const passport = require("passport");
const User = require("../models/user.model");

passport.serializeUser((user, done) => {
  console.log("serilize",user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("deserialize", id);
  const user = await User.findOne({ id });
  done(null, user);
});
