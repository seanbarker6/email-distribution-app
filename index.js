const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require('cookie-session');
const passport = require("passport");
const keys = require("./config/keys");
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
		keys: [keys.cookieKey]
	})
);

//required to initialize passport
app.use(passport.initialize());
//this initialises the session which allows deserializeUser and serializeUser to work
//whenever we receive a request to the port below
app.use(passport.session());

//import the function and immediately pass app as argument
require("./routes/authRoutes")(app);

//process.env variable is object on system containing user environment
//when we deploy our app to heroku they will tell us which port to listen
//to and store this in our process.env variable. So use this else hardcode it
const PORT = process.env.PORT || 5000;
//listen to http activity on port 5000
app.listen(PORT);
