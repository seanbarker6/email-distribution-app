//librries to help with cleaning up webhook data
const _ = require("lodash");
const { Path } = require("path-parser");
// 'url' library part of node.js library
const { URL } = require("url");

const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
//require in template which creates email HTML to add
//to mailer object
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");
const Survey = mongoose.model("surveys");

module.exports = (app) => {
  app.get("/api/surveys", requireLogin, async (req, res) => {
    //pull out all curent surveys from this User
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false,
    });
    res.send(surveys);
  });

  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
    res.send("Thanks for voting");
  });

  app.post("/api/surveys/webhooks", (req, res) => {
    //pull of survey id and choice from url by first creating
    //pathname matcher object
    const p = new Path("/api/surveys/:surveyId/:choice");
    const events = _.chain(req.body)
      .map(({ email, url }) => {
        // use path matcher object to test against our pathname var
        //: mark wildcards so above we have text after these two colons
        //stored in variables surveyId and choice.
        //new URL code gets end path of url
        const match = p.test(new URL(url).pathname);
        //p.test(pathname) above retunrs null if cant find variable for choice and surveyId
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        }
      })
      //remove undefined elements that might be present
      //(e.g. if didnt have choice and surveyId)
      .compact()
      //get unique events (both email and surveyId cant be the same)
      .uniqBy("email", "surveyId")
      .each(
        //for each event run our mongoDb query and update recipient response
        //field and increment field
        ({ surveyId, email, choice }) => {
          //destructure survey object we created
          Survey.updateOne(
            {
              //mongoDD records all have _id. Mongoose doesn't which is why wasn't
              //used everywhere
              _id: surveyId,
              recipients: {
                $elemMatch: { email: email, responded: false },
              },
            },
            {
              $inc: { [choice]: 1 },
              $set: { "recipients.$.responded": true },
              lastResponded: new Date(),
            }
          ).exec(); //execute query and send to database
        }
      )
      .value();
  });
  //create a survey which runs requireLogin middleware
  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;
    //use above properties of the request to create new instance of the survey
    //collection
    const survey = new Survey({
      //assign title var to title key using es6 short syntax
      title,
      subject,
      body,
      //recipient list will be comma seperated list when user enters it
      recipients: recipients.split(",").map((email) => {
        return { email: email.trim() };
      }),
      //get mongoDB id which has been stored in req object by passport
      _user: req.user.id,
      dateSent: Date.now(),
    });

    //send email.
    //Create mailer object instance and send to sendgrid
    const mailer = new Mailer(survey, surveyTemplate(survey));
    try {
      await mailer.send();
      //save survey to mongo DB using mongoose save() method
      await survey.save();
      req.user.credits -= 1;
      //save user and then update from previous one as old user now stale
      const user = await req.user.save();
      //send back user model to app
      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
