const passport = require("passport");

//default export of this function taking app as argument
//All routehandlers defined inside this function
module.exports = (app) => {
  //this routehandler listens to get requests to the defined endpoint.
  //it then executes the passport.authenticate action with the defined scope
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  app.get(
    "/auth/google/callback",
    //because we have the code at the end of url at this stage,
    //passport recgonises this code so knows to reach back to google to get profile based
    //on this id
    passport.authenticate("google"),
		//this then runs after passport handles authentication
    (req, res) => {
			//res has redirect object which moves browser to other route
			res.redirect('/surveys')
		}
  );

  app.get("/api/logout", (req, res) => {
    // take id inside cookie and kill cookie
    req.logout();
    //as response sent the user attached to request object
    //User prop automatically added to request object by passport. We then combined this with
    //cookie sessions and passports deserializeUser to replace the default/the user id with the actual
    //deserialized user object.
    res.redirect('/');
  });

  app.get("/api/current_user", (req, res) => {
    //send the http response back to the user
    res.send(req.user);
  });
};
