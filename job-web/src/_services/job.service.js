import config from 'config';
import { authHeader } from '../_helpers';

export const jobService = {
    createJob,
    getJobsList,
    scheduleJob,
    getScheduledJobs,
    rescheduleJob,
    createEvent,
    stopJob
};

function stopJob(jobObject) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobObject)
    };

    return fetch(`${config.apiUrl}/schedule/stop-job`, requestOptions)
        .then(handleResponse)
        .then(user => {
            return user;
        });
}

function createEvent(eventObject) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventObject)
    };

    return fetch(`${config.apiUrl}/event/create-event`, requestOptions)
        .then(handleResponse)
        .then(event => {
            return event;
        });
}


function rescheduleJob(jobObject) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobObject)
    };

    return fetch(`${config.apiUrl}/schedule/reschedule-job`, requestOptions)
        .then(handleResponse)
        .then(user => {
            return user;
        });
}

function getScheduledJobs() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${config.apiUrl}/schedule/get-all`, requestOptions)
        .then(handleResponse)
        .then(jobs => {

            return jobs;
        });
}

function scheduleJob(jobObject) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobObject)
    };

    return fetch(`${config.apiUrl}/schedule/schedule-job`, requestOptions)
        .then(handleResponse)
        .then(user => {
            return user;
        });
}

function createJob(jobObject) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobObject)
    };

    return fetch(`${config.apiUrl}/job/create`, requestOptions)
        .then(handleResponse)
        .then(user => {
            return user;
        });
}

function getJobsList() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${config.apiUrl}/job/get-jobs`, requestOptions)
        .then(handleResponse)
        .then(jobs => {

            return jobs;
        });
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/register`, requestOptions).then(handleResponse);
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/${user.id}`, requestOptions).then(handleResponse);;
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
