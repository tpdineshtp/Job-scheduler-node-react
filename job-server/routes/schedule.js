var express = require('express');
var router = express.Router();
var schedule = require('node-schedule');
var shell = require('shelljs');

var mongoose = require('mongoose'),
    ScheduleJob = mongoose.model('ScheduleJob');

var {JobScheduler, addRecurringJobEntry} = require('../job-modules/JobScheduler')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(schedule.scheduledJobs);
});

router.post('/schedule-job', function(req, res, next){

  var new_job = new ScheduleJob(req.body);
  new_job.jobType = 1;

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
          schedule.scheduledJobs[docs[i]._id.toString()].cancel();
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



})

router.post('/reschedule-job', function(req, res, next){

  var new_job = req.body;
  console.log(new_job)
  ScheduleJob.find({scheduledTime: new_job.scheduledTime, jobStatus: 0}, function(err, docs){
    if(docs.length > 0){
      for(var i = 0;i<docs.length; i++){
        if(docs[i].priority >= req.body.priority)
        {
          req.body.jobStatus = 2;
          ScheduleJob.findByIdAndUpdate(req.body._id, req.body, {new: false}, function(err, model) {
            console.log('retry failed because higher priority job already scheduled')
          })
        }
        else{
          console.log(docs[i])
          schedule.scheduledJobs[docs[i]._id.toString()].cancel();
          console.log('Existing Job cancelled')
          docs[i].jobStatus = 2;
          ScheduleJob.findByIdAndUpdate(docs[i]._id, docs[i], {new: false}, function(err, model) {
            console.log('Job failed because another high priority job came - setting status to failed');
            if(model.recurringJob){
              addRecurringJobEntry(model);
            }
          })
          req.body.jobStatus = 0;
          ScheduleJob.findByIdAndUpdate(req.body._id, req.body, {new: false}, function(err, model) {
            if(err)
              console.log(err)

            JobScheduler(req.body);
          })
        }
      }
    }
    else {
      req.body.jobStatus = 0;
      ScheduleJob.findByIdAndUpdate(req.body._id, req.body, {new: false}, function(err, model) {
        try { schedule.scheduledJobs[model._id.toString()].cancel(); } catch(err){ console.log(err)}
        JobScheduler(req.body);
      })
    }
  })


})

router.get('/get-all', function(req, res, next){
  ScheduleJob.find({}).sort([['scheduledTime', 1]]).exec(function(err, docs) {
    if(err)
      res.send(err);
    res.status(200).send(docs);
    });

})

router.post('/stop-job', function(req, res, next){
  try { schedule.scheduledJobs[req.body._id.toString()].cancel(); } catch(err){ console.log(err)}

  ScheduleJob.findByIdAndUpdate(req.body._id, req.body, {new: false}, function(err, model) {
    if(err)
      res.send(err);
    res.status(200).send(model);
  })

})

module.exports = router;
