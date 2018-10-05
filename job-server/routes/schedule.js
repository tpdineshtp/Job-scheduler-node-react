var express = require('express');
var router = express.Router();

var mongoose = require('mongoose'),
    ScheduleJob = mongoose.model('ScheduleJob');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/schedule-job', function(req, res, next){
  var new_job = new ScheduleJob(req.body);
  new_job.jobStatus = 0;
  new_job.jobType = 1;
  new_job.save(function(err, job) {
    if (err)
      res.send(err);
    res.status(200).send(job);
  });
})

router.post('/reschedule-job', function(req, res, next){
  ScheduleJob.findByIdAndUpdate(req.body._id, req.body, {new: false}, function(err, model) {
    console.log('success')
  })
})

router.get('/get-all', function(req, res, next){
  ScheduleJob.find({}).sort([['scheduledTime', 1]]).exec(function(err, docs) {
    if(err)
      res.send(err);
    res.status(200).send(docs);
    });

})

module.exports = router;
