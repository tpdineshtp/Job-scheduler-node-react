import React from 'react';

class Assignment extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <React.Fragment>
      <h1>Job Executor application</h1>
        <p>Job executor application allows you to create and schedule a job in two ways,</p>
        <p>Time specific jobs</p>
        <p>Jobs that run on a specific time. An end user can configure the time at which the job should</p>
        <p>run and whether it can run on a recurring basis.</p>
        <p>Event based jobs</p>
        <p>An end user can configure jobs based on an event. This event will be sent to your app via a
        REST API, which you expose to the end user. Job executor should execute the job configured
        against the event</p>
        .
        <p>An admin user can create a job by specifying a unique name and should specify how the job will
        be executed. (Job execution implementation is up to you. You can either get a shell script or you
        can go with a language specific implementation)</p>
        .
        <p>An user can configure how the above created job should be executed,</p>
        <p>  a. In case of time specific job, end user should be able to specify the time and whether it should
        be recurring or not.</p>
        <p>  b. In case of event specific job, end user should be able to map it against an event.</p>
        .
        <p>Job can also have a priority and the priority should be taken into account while executing a job.</p>
        .
        <p>At any point in time, an user should be able to see the scheduled jobs and the status of the last
        run jobs. (It would be nice if a filter is given)</p>
        .
        <p>An user should also be able to stop the scheduled job and should also be able to retry it incase if
        it has failed.</p>
        <h3>Deliverables</h3>
        <p>A web application running. (You can choose any framework you want for building this app)</p>
        <p>A REST API exposed to the end user for passing events</p>
        <p>An user interface, where the admin user can create a job and the end user can configure time
        specific jobs or event based jobs. We expect a minimalistic UI. You choose any framework you
        want for the UI.</p>
        <p>UI should also have option to stop, retry and edit the configuration and can also see the status of
        the jobs.</p>
      </React.Fragment>
    )
  }
}

export default Assignment;
