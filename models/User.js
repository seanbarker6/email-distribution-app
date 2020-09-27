const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  credits: { type: Number, default: 0 },
});

// create model class for mongoose. //Mongoose.model tells mongoose to create a new model class instance(mongoose)
// and therefore new collection(mongoDB) in MongoDB.
//However, if already created it wont delete it and remake it.
mongoose.model("users", userSchema);
