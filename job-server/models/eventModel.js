var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// to store the user details
var eventSchema = new Schema({
  eventName: {
    type: String,
    unique: true
  },
  jobName: {
    type: String
  },
  scheduleAfter: {
    type: Number
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
