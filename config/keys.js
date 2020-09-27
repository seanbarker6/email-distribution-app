//figure out what set of credentials to return
//heroku automatically sets NODE_ENV variable to production when
//node.js app running on it
if (process.env.NODE_ENV === 'production') {
	//we are in production - return the prod set of keys
	module.exports = require('./prod');
} else {
	// we are in development - return the dev keys
	module.exports = require('./dev');
}

//NOTE THAT WITH ES2015 MODULES WE CANT DO ANY IMPORT STATEMENTS
//AFTER LOGIC. THEY ALL HAVE TO BE DONE AT THE TOP OF THE FILE
