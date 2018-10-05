var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
var cron = require('cron');
var shell = require('shelljs');

var Job = require('./models/jobModel');
var Event = require('./models/eventModel');
var ScheduleJob = require('./models/scheduleJobModel');

var jobRouter = require('./routes/job');
var eventRouter = require('./routes/event');
var scheduleRouter = require('./routes/schedule');

var app = express();

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/job-scheduler', { useNewUrlParser: true })
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/job', jobRouter);
app.use('/event', eventRouter);
app.use('/schedule', scheduleRouter);

function addRecurringJobEntry(doc){
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
  console.log(obj)
  new_job.save(function(err, job) {
    if (err)
      console.log('recurring job failed');
    console.log('recurring job added');
  });
}

var cronJob = cron.job("0 */1 * * * *", function(){
    var t1 = new Date(), t2 = new Date();
    t2.setMinutes(t2.getMinutes()+1);

    ScheduleJob.find({"scheduledTime": {"$gte": t1, "$lt":t2}, "jobStatus":0}).sort({priority:'-1'}).exec( function(err, doc){
      if(doc.length > 0){

        if(doc[0].recurringJob){
          addRecurringJobEntry(doc[0]);
        }
        doc[0].jobStatus = 1;

        ScheduleJob.findByIdAndUpdate(doc[0]._id, doc[0], {new: false}, function(err, model) {
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
      }
      if(doc.length > 1){
          for(var i=1;i<doc.length;i++){
            if(doc[i].recurringJob){
              addRecurringJobEntry(doc[i]);
            }

            doc[i].jobStatus = 2;
            ScheduleJob.findByIdAndUpdate(doc[i]._id, doc[i], {new: false}, function(err, model) {
              shell.echo('Job failed - setting status to failed');
            })
          }
      }
    })

    ScheduleJob.find({"scheduledTime": {"$lt": t1}, "jobStatus":0}, function(err, doc){
      for(var i=0;i<doc.length;i++){
        if(doc[i].recurringJob){
          addRecurringJobEntry(doc[i]);
        }

        doc[i].jobStatus = 2;
        ScheduleJob.findByIdAndUpdate(doc[i]._id, doc[i], {new: false}, function(err, model) {
          shell.echo('Job did not start at time - setting status to failed');
        })
      }
    })


});
cronJob.start();

module.exports = app;
