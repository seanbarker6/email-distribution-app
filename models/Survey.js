const mongoose = require("mongoose");
//destructure out schema object
const { Schema } = mongoose;
const RecipientSchema = require("./Recipient");

//create new schema instance
const surveySchema = new Schema({
  title: String,
  body: String,
  subject: String,
  //create subdocument collection with scheme inside this schema
  recipients: [RecipientSchema],
  yes: { type: Number, default: 0 },
  no: { type: Number, default: 0 },
  //add prop which references the use who created
  //the record
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  dateSent: Date,
  lastResponded: Date
});
//THIS CREATES A MONGOOSE CLASS/MONGODB COLLECTION WITH THE NAME SURVEYS
console.log('test')
mongoose.model("surveys", surveySchema);
