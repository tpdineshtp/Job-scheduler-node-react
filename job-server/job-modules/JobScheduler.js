var shell = require('shelljs');
var schedule = require('node-schedule');

var Job = require('../models/jobModel');
var Event = require('../models/eventModel');
var ScheduleJob = require('../models/scheduleJobModel');



var addRecurringJobEntry = function (doc){
  var obj = [];
  var jtime = new Date(doc.scheduledTime);
  jtime.setHours(jtime.getHours() + doc.recurringInterval);
  obj.jobName = doc.jobName;
  obj.priority = doc.priority;
  obj.recurringJob = doc.recurringJob;
  obj.recurringInterval = doc.recurringInterval;
  obj.jobStatus = 0;
  obj.jobType = doc.jobType;
  obj.scheduledTime = jtime;

  var new_job = new ScheduleJob(obj);
  new_job.save(function(err, job) {
    if (err)
      console.log('recurring job failed');
    console.log('recurring job added');
    JobScheduler(doc);
  });
}

var JobScheduler = function (doc){
  var date = new Date(doc.scheduledTime);
  schedule.scheduleJob(doc._id.toString(), date, function(doc){

    if(doc.recurringJob){
      addRecurringJobEntry(doc);
    }

    doc.jobStatus = 1;
    ScheduleJob.findByIdAndUpdate(doc._id, doc, {new: false}, function(err, model) {

      shell.exec(model.jobName+'.sh', function(code, stdout, stderr) {
      if(code !== 0) {
        model.jobStatus = 2;
        ScheduleJob.findByIdAndUpdate(model._id, model, {new: false}, function(err, model) {
          shell.echo('Job failed - setting status to failed');
        })
      }
      else {
        model.jobStatus = 3;
        ScheduleJob.findByIdAndUpdate(model._id, model, {new: false}, function(err, model) {
          shell.echo('Job completed - setting status to success');
        })
      }
      });

    })

  }.bind(null, doc));
}

module.exports ={JobScheduler, addRecurringJobEntry}
