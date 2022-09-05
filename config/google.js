require("dotenv").config();
const passport = require("passport");
const UserService = require("../models/user.index");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("------------------------------");
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
      console.log("profile", profile);
      console.log("done", done);
      console.log("------------------------------");
      const id = profile.id;
      const email = profile.emails[0].value;
      const firstName = profile.name.givenName;
      const lastName = profile.name.familyName;
      const profilePhoto = profile.photos[0].value;

      const currentUser = await UserService.getUserByEmail({ email });

      if (!currentUser) {
        const newUser = await UserService.addGoogleUser({
          id,
          email,
          firstName,
          lastName,
          profilePhoto,
        });
        return done(null, newUser);
      }
      console.log("added");

      if (currentUser.source != "google") {
        //return error
        return done(null, false, {
          message: `You have previously signed up with a different signin method`,
        });
      }
      console.log("checked");

      currentUser.lastVisited = new Date();
      return done(null, currentUser);
    }
  )
);
