import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {jobActions } from '../_actions'

class RenderTableRow extends React.Component {
    constructor(props) {
        super(props);
        var date = new Date();
        date.setHours(date.getHours()+5);
        date.setMinutes(date.getMinutes()+30);
        this.state = {
          jobTime: date.toISOString().slice(0,16),
        }
    }

    componentDidMount(){
    }
    getStatus(status){
      if(status == 1)
        return 'pendiente'
      else if(status == 2)
        return 'cancelado'
      else if(status == 3)
        return 'pagado'
      else
        return 'upcoming';
    }
    getStatusText(status) {
      if(status == 1)
        return 'Running'
      else if(status == 2)
        return 'Failed'
      else if(status == 3)
        return 'Success'
      else
        return 'Scheduled';
    }
    handleChange(e){
      this.setState({
        jobTime: e.target.value
      })
    }
    rescheduleJob(){
      var obj = this.props.renderJob;
      obj.scheduledTime = this.state.jobTime;
      obj.jobStatus = 0;
      this.props.dispatch(jobActions.rescheduleJob(obj))
      $('#myModal-'+this.props.renderJob._id).hide();
      this.props.dispatch(jobActions.getScheduledJobs())
    }

    render() {
        const {renderJob} = this.props;
        var date = new Date(renderJob.scheduledTime).toLocaleString();
        return (
        <React.Fragment>
        <tr data-status={this.getStatus(renderJob.jobStatus)}>

          <td>
            <div className="media">
              <div className="media-body">
                <span className="media-meta pull-right">{date}</span>
                <h4 className="title">
                  {renderJob.jobName}

                  <span className={"pull-right "+this.getStatus(renderJob.jobStatus)}>{this.getStatusText(renderJob.jobStatus)}</span>
                                    <span className="pull-right">({renderJob.jobType == 1 ? 'time' : 'event'})</span>
                </h4>
              </div>
            </div>
          </td>
          <td>
            <a href="javascript:;" className="star">
            <div>
                {renderJob.jobStatus==2 && <button type="button" class="btn btn-fresh text-capitalize btn-xs" data-toggle="modal" href={"#myModal-"+renderJob._id}>Retry</button>}
                <button type="button" class="btn btn-hot text-capitalize btn-xs">Delete</button>

            </div>
            </a>
          </td>
        </tr>
        <div id={"myModal-"+renderJob._id} class="modal fade in">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h4 class="modal-title">Reschedule Job</h4>
                </div>
                <div class="modal-body">
                <input type="datetime-local" className="form-control"  value={this.state.jobTime}  onChange={this.handleChange.bind(this)} />

                </div>
                <div class="modal-footer">
                    <div class="btn-group" style={{margin: "0"}}>
                        <button class="btn btn-danger" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span> Cancel</button>
                        <button class="btn btn-primary" onClick={this.rescheduleJob.bind(this)}><span class="glyphicon glyphicon-check" ></span> Save</button>
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

const connectedRenderTableRow = connect(mapStateToProps)(RenderTableRow);
export { connectedRenderTableRow as RenderTableRow };
