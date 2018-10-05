var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// to store the user details
var scheduleJobSchema = new Schema({
  jobName: {
    type: String
  },
  scheduledTime: {
    type: Date
  },
  recurringJob: {
    type: Boolean
  },
  recurringInterval: {
    type: Number
  },
  priority: {
    type: Number
  },
  jobStatus: {
    type: Number
  },
  jobType: {
    type: Number
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ScheduleJob', scheduleJobSchema);
