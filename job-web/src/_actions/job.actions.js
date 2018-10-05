import { jobConstants } from '../_constants';
import { jobService } from '../_services';

export const jobActions = {
    createJob,
    getJobsList,
    scheduleJob,
    getScheduledJobs,
    rescheduleJob,
    createEvent
};

function createEvent(eventObject) {
    return dispatch => {

        jobService.createEvent(eventObject)
            .then(
                event => {
                    dispatch(success(event));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(event) { return { type: jobConstants.EVENT_CREATE_SUCCESS, event } }
    function failure(error) { return { type: jobConstants.EVENT_CREATE_FAILURE, error } }
}


function rescheduleJob(jobObject) {
    return dispatch => {

        jobService.rescheduleJob(jobObject)
            .then(
                job => {
                    dispatch(success(job));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(job) { return { type: jobConstants.JOB_RESCHEDULE_SUCCESS, job } }
    function failure(error) { return { type: jobConstants.JOB_RESCHEDULE_FAILURE, error } }
}


function getScheduledJobs() {
    return dispatch => {

        jobService.getScheduledJobs()
            .then(
                job => {
                    dispatch(success(job));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(job) { return { type: jobConstants.GET_SCHEDULED_JOBS_SUCCESS, job } }
    function failure(error) { return { type: jobConstants.GET_SCHEDULED_JOBS_FAILURE, error } }
}

function scheduleJob(jobObject) {
    return dispatch => {

        jobService.scheduleJob(jobObject)
            .then(
                job => {
                    dispatch(success(job));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(job) { return { type: jobConstants.JOB_SCHEDULE_SUCCESS, job } }
    function failure(error) { return { type: jobConstants.JOB_SCHEDULE_FAILURE, error } }
}


function createJob(jobObject) {
    return dispatch => {

        jobService.createJob(jobObject)
            .then(
                job => {
                    dispatch(success(job));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(job) { return { type: jobConstants.JOB_CREATE_SUCCESS, job } }
    function failure(error) { return { type: jobConstants.JOB_CREATE_FAILURE, error } }
}

function getJobsList() {
    return dispatch => {

        jobService.getJobsList()
            .then(
                jobs => {
                    dispatch(success(jobs));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(jobs) { return { type: jobConstants.GET_JOBS_LIST_SUCCESS, jobs } }
    function failure(error) { return { type: jobConstants.GET_JOBS_LIST_FAILURE, error } }
}
