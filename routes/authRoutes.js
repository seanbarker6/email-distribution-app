const passport = require("passport");

module.exports = (app) => {
	app.get(
		"/auth/google",
		passport.authenticate("google", {
			scope: ["profile", "email"],
		})
	);

	app.get(
		"/auth/google/callback",
		//because we have the code at the end of url at this stage,
		//passport knows to reach back to google to get profile based
		//on this id
		passport.authenticate("google")
	);

	app.get("/api/logout", (req,res) => {
		// take id inside cookie and kill cookie
		req.logout()
		res.send(req.user)
	})

	app.get("/api/current_user", (req, res) => {
		res.send(req.user)
	});
};

