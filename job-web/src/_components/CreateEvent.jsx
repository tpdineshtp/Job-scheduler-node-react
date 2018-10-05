import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {jobActions } from '../_actions'

class CreateEvent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          selectedJob: 'Select Job',
          eventName: '',
          runAfter: '',
        }
    }

    componentDidMount(){
      this.props.dispatch(jobActions.getJobsList())
    }

    handleChange(e){
      const {name, value} = e.target;
      this.setState({
        [name]: value
      })
    }

    handleDropdownChange(value, id){
      this.setState({selectedJob: value});
    }

    submitValue(e){
      e.preventDefault();
      const {dispatch} = this.props;
      var eventObject ={
        jobName: this.state.selectedJob,
        eventName: this.state.eventName,
        scheduleAfter: this.state.runAfter
      }
      debugger;
      dispatch(jobActions.createEvent(eventObject))
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
                                    {this.props.job.eventCreated &&
                                      <div className="alert alert-success" role="alert">
                                        Event created
                                      </div>}
                                    <h2>Create Event</h2>

                                     <form className="signup" action="#" method="post">
                                       <div className="form-group">
                                         <input type="text" className="form-control" placeholder="Event Name" name='eventName' value={this.state.eventName} onChange={this.handleChange.bind(this)} required/>
                                       </div>
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
                                          <input type="text" className="form-control" placeholder="Job run after (in hours)" name='runAfter' value={this.state.runAfter} onChange={this.handleChange.bind(this)} required/>
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

const connectedCreateEvent = connect(mapStateToProps)(CreateEvent);
export { connectedCreateEvent as CreateEvent };
