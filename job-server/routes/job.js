var express = require('express');
var router = express.Router();
const fs = require('fs');

var mongoose = require('mongoose'),
    Job = mongoose.model('Job');

/* GET home page. */
router.get('/health-check', function(req, res, next) {
  res.send('Hello World');
});

router.get('/get-jobs', function(req, res, next) {
  Job.find({}, function(err, job){
    if(err)
      res.send(err);

    res.status(200).send(job);
  })
});

router.post('/create', function(req, res, next) {
  Job.find({ jobName : req.body.jobName } , function(err, job) {
    if (err)
      res.send(err);

    // validates if jobname already exists
    if (job.length!=0) {
      res.status(409).send();
    }
    else{
      var fname = req.body.jobName + '.sh';
      fs.writeFile(fname, req.body.shellCommand, (err) => {
        if (err) throw err;
        console.log('The job has been saved!');
      });
      var new_job = new Job(req.body);
      new_job.save(function(err, job) {
        if (err)
          res.send(err);
        res.status(200).send(job);
      });
    }
  });
});

module.exports = router;
