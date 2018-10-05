import { jobConstants } from '../_constants';

export function job(state = {}, action) {
  switch (action.type) {
    case jobConstants.JOB_CREATE_SUCCESS:
    return {
      ...state,
      jobCreated: true,
      jobObject: action.job
    }
    case jobConstants.GET_JOBS_LIST_SUCCESS:
    return {
      ...state,
      jobsList: action.jobs
    }
    case jobConstants.JOB_SCHEDULE_SUCCESS:
    return {
      ...state,
      jobScheduled: true
    }
    case jobConstants.GET_SCHEDULED_JOBS_SUCCESS:
    return {
      ...state,
      scheduledJobs: action.job
    }
    case jobConstants.JOB_RESCHEDULE_SUCCESS:
    return {
      ...state,
      jobRescheduled: true
    }
    case jobConstants.EVENT_CREATE_SUCCESS:
    return {
      ...state,
      eventCreated: true
    }
    default:
      return state
  }
}
