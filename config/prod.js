module.exports = {
	googleClientID: process.env.GOOGLE_CLIENT_ID,
	googleClientSecret:process.env.GOOGLE_CLIENT_SECRET,
	//because deploying via heroku we set this env variable on herokus website.
	//when app is deployed via heroku it then sets the MONGO_URI variable to
	//the value we supplied which was taken from mongo and added to herokus config vars
	mongoURI:process.env.MONGO_URI,
	cookieKey:process.env.COOKIE_KEY
};
