const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  _id: { type: String },
  blacklist: {type: Boolean, default: false},
  about: {type: String, default: "null"},
  gay: {type: String, default:'null'},
  marry: {
    time: { type: Number, default: 0 },
    user: { type: String, default: "null" },
    has: { type: Boolean, default: false },
  },
  
});

const User = mongoose.model("Users", userSchema);
module.exports = User;
