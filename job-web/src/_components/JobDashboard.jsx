import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {jobActions } from '../_actions';
import {RenderTableRow} from './RenderTableRow.jsx'

class JobDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount(){
      this.props.dispatch(jobActions.getScheduledJobs())
      $(document).ready(function () {

	$('.star').on('click', function () {
      $(this).toggleClass('star-checked');
    });

    $('.ckbox label').on('click', function () {
      $(this).parents('tr').toggleClass('selected');
    });

    $('.btn-filter').on('click', function () {
      var $target = $(this).data('target');
      if ($target != 'all') {
        $('.table tr').css('display', 'none');
        $('.table tr[data-status="' + $target + '"]').fadeIn('slow');
      } else {
        $('.table tr').css('display', 'none').fadeIn('slow');
      }
    });

 });
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
        <section className="content">
          <h2>Jobs Dashboard</h2>
            <div>
              <div className="panel panel-default">
                <div className="panel-body">
                  <div className="pull-right">
                    <div className="btn-group">
                      <button type="button" className="btn btn-success btn-filter" data-target="pagado">Success</button>
                      <button type="button" className="btn btn-warning btn-filter" data-target="pendiente">Running</button>
                      <button type="button" className="btn btn-danger btn-filter" data-target="cancelado">Failed</button>
                      <button type="button" className="btn btn-info btn-filter" data-target="upcoming">upcoming</button>
                      <button type="button" className="btn btn-default btn-filter" data-target="all">All</button>
                    </div>
                  </div>
                  <div className="table-container">
                    <table className="table table-filter">
                      <tbody>
                        {
                          this.props.job.scheduledJobs.map((job, index) => {
                            return (
                              <RenderTableRow key = {index} renderJob={job} />
                            )
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
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

const connectedJobDashboard = connect(mapStateToProps)(JobDashboard);
export { connectedJobDashboard as JobDashboard };
