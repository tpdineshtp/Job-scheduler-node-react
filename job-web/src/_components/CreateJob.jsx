import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {jobActions } from '../_actions'

class CreateJob extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          jobName: '',
          shellCommand: ''
        }
    }

    handleChange(e){
      const {name, value} = e.target;
      this.setState({
        [name]: value
      })
    }

    submitValue(e){
      e.preventDefault();
      const {dispatch} = this.props;
      var jobObject ={
        jobName: this.state.jobName,
        shellCommand: this.state.shellCommand
      }
      dispatch(jobActions.createJob(jobObject))
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
                                    {this.props.job.jobCreated &&
                                      <div className="alert alert-success" role="alert">
                                        job created
                                      </div>}
                                    <h2>Create Job</h2>

                                     <form className="signup" action="#" method="post">
                                        <div className="form-group">
                                          <input type="text" className="form-control" placeholder="Job Name" name='jobName' value={this.state.jobName} onChange={this.handleChange.bind(this)} required/>
                                        </div>
                                        <div className="form-group">
                                          <textarea rows="4"  className="form-control" placeholder="Shell Query" name='shellCommand' value={this.state.shellCommand} onChange={this.handleChange.bind(this)} required></textarea>
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

const connectedCreatedJob = connect(mapStateToProps)(CreateJob);
export { connectedCreatedJob as CreateJob };
