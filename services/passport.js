const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  //send user.id into the cookie
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  //need to use id in cookie to find mongoose model instance
  //and hence mongoDB collection entry
  User.findById(id).then((user) => {
    done(null, user);
  });
});

// send new instance of GoogleStrategy object into
//passport.use
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      //search to see if user already exists. async request so returns prmoise
      User.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) {
          // we already have a record with the given profileID
          done(null, existingUser);
        } else {
          // we don't have a record with this ID, make a new record.
          //again this is async request
          new User({ googleId: profile.id })
            .save()
            .then((user) => done(null, user));
        }
      });
    }
  )
);
