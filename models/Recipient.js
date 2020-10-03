const mongoose = require("mongoose");
const { Schema } = mongoose;

//create subdoc class for each individual recipient of any
//given survey
const recipientSchema = new Schema({
  email: String,
  responded: { type: Boolean, default: false },
});

module.exports = recipientSchema;
