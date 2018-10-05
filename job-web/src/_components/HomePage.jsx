import React from 'react';
import { Router, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Assignment from './assignment.jsx'
import {CreateJob} from './CreateJob.jsx'
import {ScheduleJob} from './ScheduleJob.jsx'
import {JobDashboard} from './JobDashboard.jsx'
import {jobActions } from '../_actions'
import {CreateEvent} from './CreateEvent.jsx'
import {JobList} from './JobList.js'


class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          selectedComponent: 'assignment'
        }
    }

    componentDidMount(){
      this.props.dispatch(jobActions.getJobsList())
      this.props.dispatch(jobActions.getScheduledJobs())

      $(document).ready(function () {
  var trigger = $('.hamburger'),
      overlay = $('.overlay'),
     isClosed = false;

    trigger.click(function () {
      hamburger_cross();
    });

    function hamburger_cross() {

      if (isClosed == true) {
        overlay.hide();
        trigger.removeClass('is-open');
        trigger.addClass('is-closed');
        isClosed = false;
      } else {
        overlay.show();
        trigger.removeClass('is-closed');
        trigger.addClass('is-open');
        isClosed = true;
      }
  }

  $('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
  });
});
    }

    handleClick(e){
      switch (e) {
        case 'create-job':
            this.setState({selectedComponent: 'create-job'})
            break;
        case 'schedule-job':
            this.setState({selectedComponent: 'schedule-job'})
            break;
        case 'job-dashboard':
            this.setState({selectedComponent: 'job-dashboard'})
            break;
        case 'create-event':
            this.setState({selectedComponent: 'create-event'})
            break;
        case 'job-list':
            this.setState({selectedComponent: 'job-list'})
            break;

        default:
            this.setState({selectedComponent: 'assignment'})
            break;

      }
    }
    render() {
        return (
          <div id="wrapper">
       <div className="overlay"></div>

       <nav className="navbar navbar-inverse navbar-fixed-top" id="sidebar-wrapper" role="navigation">
           <ul className="nav sidebar-nav">
               <li className="sidebar-brand">
                   <a href="javascript:void(0)" onClick={this.handleClick.bind(this, 'assignment')}> Job Scheduler</a>
               </li>
               <li>
                   <a href="javascript:void(0)"  onClick={this.handleClick.bind(this, 'create-job')}> Create Job</a>
               </li>
               <li>
                   <a href="javascript:void(0)"  onClick={this.handleClick.bind(this, 'job-list')}> Job List</a>
               </li>
               <li>
                    <a href="javascript:void(0)"  onClick={this.handleClick.bind(this, 'create-event')}> Create Event</a>
               </li>
               <li>
                   <a href="javascript:void(0)"  onClick={this.handleClick.bind(this, 'schedule-job')}> Schedule Job</a>
               </li>
               <li>
                   <a href="javascript:void(0)"  onClick={this.handleClick.bind(this, 'job-dashboard')}> Job's Dashboard</a>
               </li>
               <li>
                   <a href="#"> Github Link</a>
               </li>
           </ul>
       </nav>

       <div id="page-content-wrapper">
           <button type="button" className="hamburger is-closed" data-toggle="offcanvas">
               <span className="hamb-top"></span>
         <span className="hamb-middle"></span>
       <span className="hamb-bottom"></span>
           </button>
           <div className="container">
               <div className="row">
                   <div className="col-lg-8 col-lg-offset-2">
                      {this.state.selectedComponent == 'assignment' && <Assignment/> }
                       {this.state.selectedComponent == 'create-job' && <CreateJob/>}
                       {this.state.selectedComponent == 'schedule-job' && <ScheduleJob/>}
                       {this.state.selectedComponent == 'job-dashboard' && <JobDashboard/>}
                       {this.state.selectedComponent == 'create-event' && <CreateEvent/>}
                       {this.state.selectedComponent == 'job-list' && <JobList/>}

                   </div>
               </div>
           </div>
       </div>
       </div>
        );
    }
}

function mapStateToProps(state) {
    const {job} = state;
    return {
      job
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };
