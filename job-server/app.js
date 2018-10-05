var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
var cron = require('cron');
var shell = require('shelljs');
var schedule = require('node-schedule');

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
  new_job.save(function(err, job) {
    if (err)
      console.log('recurring job failed');
    console.log('recurring job added');
    JobScheduler(doc);
  });
}

function JobScheduler(doc){
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


function ScheduleJobs(){
  ScheduleJob.find({"scheduledTime": {"$gte": new Date()}, "jobStatus":0}).sort({scheduledTime:'1', priority:'1'}).exec( function (err, docs){
      for(var i = 0; i<docs.length - 1; i++){
        var d1 = new Date(docs[i].scheduledTime);
        var d2 = new Date(docs[i+1].scheduledTime);
        if(d1.valueOf() == d2.valueOf()){
          if(docs[i].recurringJob){
            addRecurringJobEntry(docs[i]);
          }

          docs[i].jobStatus = 2;
          ScheduleJob.findByIdAndUpdate(docs[i]._id, docs[i], {new: false}, function(err, model) {
            shell.echo('Low priority job - setting status to failed');
          })
        }
        else{
          JobScheduler(docs[i]);
        }
      }
      if(docs.length> 0 ){
        JobScheduler(docs[docs.length - 1]);
      }
  })

  ScheduleJob.find({"scheduledTime": {"$lt": new Date()}, "jobStatus":0}, function(err, doc){
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


}
ScheduleJobs();

module.exports = app;
