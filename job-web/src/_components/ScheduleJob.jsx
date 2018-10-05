import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {jobActions } from '../_actions'

class ScheduleJob extends React.Component {
    constructor(props) {
        super(props);
        var date = new Date();
        date.setHours(date.getHours()+5);
        date.setMinutes(date.getMinutes()+30);
        this.state = {
          selectedJob: 'Select Job',
          jobTime: date.toISOString().slice(0,16),
          isRecurrance: false,
          recurringInterval: '',
          priority: ''
        }
    }

    componentDidMount(){
      this.props.dispatch(jobActions.getJobsList())
    }

    handleDropdownChange(value, id){
      this.setState({selectedJob: value});
    }

    handleChange(e){
      const {name, value} = e.target;
      this.setState({
        [name]: value
      })
    }
    handleButtonClick(){
      this.setState({isRecurrance: !this.state.isRecurrance});
    }

    submitValue(e){
      e.preventDefault();
      const {dispatch} = this.props
      var scheduleObj = {
        jobName: this.state.selectedJob,
        scheduledTime: this.state.jobTime,
        recurringJob: this.state.isRecurrance,
        recurringInterval: this.state.recurringInterval,
        priority: this.state.priority
      }

      dispatch(jobActions.scheduleJob(scheduleObj))
    }

    render() {
        return (
        <React.Fragment>
          <div className="col-md-9">
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12">
                             <div className="col-md-9 ">
                                    <div className="form-group">
                                    {this.props.job.jobScheduled &&
                                      <div className="alert alert-success" role="alert">
                                        job scheduled
                                      </div>}
                                    <h2>Schedule Job</h2>

                                     <form className="signup" action="#" method="post">
                                        <div className="form-group">
                                        <div className="dropdown">
                                          <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" style={{width: '100%'}}>{this.state.selectedJob}
                                          <span className="caret"></span></button>
                                          <ul className="dropdown-menu" style={{width: '100%'}}>
                                            {this.props.job.jobsList.map((job,index) => {
                                              return (
                                                <li key={index}><a href="JavaScript:void(0)" onClick={this.handleDropdownChange.bind(this, job.jobName, job._id)}>{job.jobName}</a></li>
                                              )
                                            })}
                                          </ul>
                                          </div>
                                        </div>
                                        <div className="form-group">
                                        <input type="datetime-local" className="form-control" value={this.state.jobTime} name='jobTime'  onChange={this.handleChange.bind(this)}  required/>
                                        </div>
                                        <div className="form-group">
                                          <span className="button-checkbox">
                                              <button type="button" className={this.state.isRecurrance ? "btn btn-primary active" : 'btn btn-default'} data-color="primary" onClick={this.handleButtonClick.bind(this)}><i className="state-icon glyphicon glyphicon-check"></i>&nbsp; Recurrance</button>
                                              <input type="checkbox" className="hidden" />
                                          </span>
                                        </div>
                                        { this.state.isRecurrance &&
                                        <div className="form-group">
                                          <input type="Number" className="form-control" value = {this.state.recurringInterval} name='recurringInterval' onChange={this.handleChange.bind(this)} placeholder="Enter recurring Time interval" required />
                                        </div>}
                                        <div className="form-group">
                                          <input type="Number" className="form-control" value = {this.state.priority} name='priority' onChange={this.handleChange.bind(this)} placeholder="Enter Priority" required />
                                        </div>

                                        <div className="form-group">
                                          <input type="submit" className="btn btn-success "  value="SUBMIT" onClick={this.submitValue.bind(this)}/>
                                        </div>
                                      </form>


                                    </div>

                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </React.Fragment>
      );
    }
}

function mapStateToProps(state) {
    const { job } = state;
    return {
        job
    };
}

const connectedScheduleJob = connect(mapStateToProps)(ScheduleJob);
export { connectedScheduleJob as ScheduleJob };
