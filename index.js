const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");
const bodyParser = require("body-parser");
require("./models/User");
require("./services/passport");

//connect mongoose to the port our mongo database is running on (we specified this in heroku)
mongoose.connect(keys.mongoURI);
//create instance of express server and run it
const app = express();
//When a request comes in to express, cookie-session takes the cookie data out of the cookie
//and assigns it to req.session object inside express
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    //random key just for encryption purposes
    keys: [keys.cookieKey],
  })
);

//required to initialize passport
//app.use is used to load in middleware to our express server
app.use(passport.initialize());
//this initialises the session which allows deserializeUser and serializeUser to work
//whenever we receive a request to the port below
app.use(passport.session());
//.json means only parses json to server
app.use(bodyParser.json());

//import the function and immediately pass app as argument
require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);

//if we are on heroku run this
if (process.env.NODE_ENV === "production") {
  //ensure express will serve up produciton assets
  //like our main.js file or main.css file

  //Code below means if receive a route that isn't defined in
  //any route handlers, then check client/build directory
  //uploaded to heroku to see if theres a file matching
  //the requested route
  app.use(express.static("client/build"));
	//if doesnt find anything specific here then run code below.
  // Code below: express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require("path");
	//define route handler
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//process.env variable is object on system containing user environment
//when we deploy our app to heroku they will tell us which port to listen
//to and store this in our process.env variable. So use this else hardcode it
const PORT = process.env.PORT || 5000;
//listen to http activity on port 5000
app.listen(PORT);
