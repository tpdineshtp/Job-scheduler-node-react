var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// to store the user details
var jobSchema = new Schema({
  jobName: {
    type: String,
    unique: true
  },
  shellCommand: {
    type: String
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);
