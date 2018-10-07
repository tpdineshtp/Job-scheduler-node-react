var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// to store the user details
var userSchema = new Schema({
  userName: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  userGroup: {
    type: String
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
