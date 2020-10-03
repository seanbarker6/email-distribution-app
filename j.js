Survey.updateOne(
  //first object defined wwhat record in database we want to
  //access
  {
    _id: surveyId, //first find survey with this id
    recipients: {
      $elemMatch: { email: email, responded: false },
    }, //then search through subdoc and find the one with both above props
  }, //the whole request so far returns the entire object/record which meets the above
  //criteria
  //update that record with the object below
  {
    $inc: { [choice]: 1 },//increment by 1
    $set: { "recipients.$.responded": true },//update subdocument

  }
