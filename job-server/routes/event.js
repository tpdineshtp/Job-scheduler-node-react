var express = require('express');
var router = express.Router();
var schedule = require('node-schedule');
var shell = require('shelljs');

var mongoose = require('mongoose'),
    Event = mongoose.model('Event'),
    ScheduleJob = mongoose.model('ScheduleJob');
var {JobScheduler, addRecurringJobEntry} = require('../job-modules/JobScheduler')

/* GET home page. */
router.get('/health-check', function(req, res, next) {
  res.send('Hello World');
});

router.post('/create-event', function(req, res, next) {
  var new_event = new Event(req.body);
  new_event.save(function(err, event) {
    if (err)
      res.send(err);
    res.status(200).send(event);
  });
})

router.get('/trigger-event/:eventName', function(req, res, next) {

  Event.find({eventName: req.params.eventName}, function(err, event){
    if(event.length){
      var date = new Date();
      date.setHours(date.getHours() +(event[0].scheduleAfter ?  event[0].scheduleAfter : 0 ));

      var new_job = new ScheduleJob();
      new_job.jobStatus = 0;
      new_job.jobType = 2;
      new_job.jobName = event[0].jobName;
      new_job.recurringJob = false;
      new_job.recurringInterval = 0;
      new_job.scheduledTime = date;
      new_job.priority = 0;

      ScheduleJob.find({scheduledTime: new_job.scheduledTime, jobStatus: 0}, function(err, docs){
        if(docs.length > 0){
          for(var i = 0;i<docs.length; i++){
            if(docs[i].priority >= new_job.priority)
            {
              new_job.jobStatus = 2;
              new_job.save(function(err, job) {
                if (err)
                  res.send(err);

                  if(job.recurringJob){
                    addRecurringJobEntry(job);
                  }
                res.status(200).send(job);
              });
            }
            else{
              try{
              schedule.scheduledJobs[docs[i]._id.toString()].cancel();
              }
              catch(err){}
              console.log('Existing Job cancelled')
              docs[i].jobStatus = 2;
              ScheduleJob.findByIdAndUpdate(docs[i]._id, docs[i], {new: false}, function(err, model) {
                console.log('Job failed because another high priority job came - setting status to failed');
                if(model.recurringJob){
                  addRecurringJobEntry(model);
                }
              })
              new_job.jobStatus = 0;
              new_job.save(function(err, job) {
                if (err)
                  res.send(err);

                JobScheduler(job);
                res.status(200).send(job);
              });
            }
          }
        }
        else {
        new_job.jobStatus = 0;
        new_job.save(function(err, job) {
          if (err)
            res.send(err);

          JobScheduler(job);
          res.status(200).send(job);
        });
        }
      })
    }

  })
});

module.exports = router;
