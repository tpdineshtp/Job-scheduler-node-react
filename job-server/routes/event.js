var express = require('express');
var router = express.Router();

var mongoose = require('mongoose'),
    Event = mongoose.model('Event'),
    ScheduleJob = mongoose.model('ScheduleJob');

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
      date.setMinutes(date.getMinutes() + 1);

      var new_job = new ScheduleJob();
      new_job.jobStatus = 0;
      new_job.jobType = 2;
      new_job.jobName = event[0].jobName;
      new_job.recurringJob = false;
      new_job.recurringInterval = 0;
      new_job.scheduledTime = date;
      new_job.priority = 0;
      new_job.save(function(err, job) {
        if (err)
          res.send(err);
        res.status(200).send(job);
      });
    }

  })
});

module.exports = router;
