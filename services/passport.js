const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

//load in the mongoose model class which we previously constructed in the User.js file
const User = mongoose.model("users");

//the user argument this receives is the same user passed into the done method below
//from inside the GoogleStrategy callback
passport.serializeUser((user, done) => {
  //send user.id into the cookie
  //note that this is not the google profile id defined below.
  //Recall that when we created a User below inside GoogleStrategy
  //we passed in the google profile.id property. However, on creating this record MongoDB also
  //creates its own random id for this collection entry. This is what we are accessing by doing
  //user.id
  done(null, user.id);
});

//this takes id that was in cookie and turns it back into user model
passport.deserializeUser((id, done) => {
  //need to use id in cookie to find mongoose model instance/the user for that id
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
          //done keyword informs passport we are done with callbacks and that it should resume
          //with authentication process. This is passport specific
          done(null, existingUser);
        } else {
          // we don't have a record with this ID, make a new record.
          //again this is async request
          //create new instance of the mongoose model class we loaded in above, and pass
          // in its attributes
          new User({ googleId: profile.id })
            .save()
            .then((user) => done(null, user));
        }
      });
    }
  )
);
