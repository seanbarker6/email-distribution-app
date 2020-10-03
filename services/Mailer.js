//email considered a service to the app
//so place all email logic in here
const sendgrid = require("sendgrid");
const helper = sendgrid.mail;
const keys = require("../config/keys");

//inherit methods from helper.Mail
class Mailer extends helper.Mail {
  //deconstruct props and send to constructor
  constructor({ subject, recipients }, content) {
    //call parent constructor so we can inherit methods/attributes
    super();

    this.sgApi = sendgrid(keys.sendGridKey);
    this.from_email = new helper.Email("seanbarker6@sky.com");
    this.subject = subject;
    this.body = new helper.Content("text/html", content);
    this.recipients = this.formatAddresses(recipients);
    //ensure content is added to body of mailer using help.Mail method
    this.addContent(this.body);
    this.addClickTracking();
    this.addRecipients();
  }

  formatAddresses(recipients) {
    //destructure email property from the object. Needs to be
    //wrapped in curly braces if you are doing it as input
    //to arrow function
    return recipients.map(({ email }) => {
      return new helper.Email(email);
    });
  }

  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipients() {
    const personalize = new helper.Personalization();

    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });
    this.addPersonalization(personalize);
  }

  async send() {
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON()
    });
    //send to sendgrid
    const response = await this.sgApi.API(request);
    return response;
  }
}

module.exports = Mailer;
