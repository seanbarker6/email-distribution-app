const keys = require('../config/keys')
//create stripe object
const stripe = require("stripe")(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  //get route handler to listen for post requests to specified route
  app.post('/api/stripe', requireLogin, async (req, res) => {
    //create new charge object using the credit card token
    //in the request body. Note that create returns promise
    //as we are reaching out to Stripe api
    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: '$5 for 5 credits',
      source: req.body.id
    })
    //update credits property of mongoose (and hence MongoDB) user model
    //passport means that the user model is always part of the request
    //object
    req.user.credits += 5
    //save the user model to MongoDB.
    const user = await req.user.save()
    //now send the new user saved to mongoDB, with overwritten
    //credits property to Browser
    //The new credit amount should therefore show up in google chrome
    //network tab for the response to this request.
    //will show up under post to /api/stripe as chrome shows front
    //end request only and this is here the front end post request was
    //directed.
    //Back end request above when charge object created
    //is a back end request so not shown in chrome
    res.send(user)
    //so we first comm with stripe server inside back end to get charge object. then
    //then process in back end and send back to browser
  });
};
