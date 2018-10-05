import { combineReducers } from 'redux';

import { job } from './job.reducer';


const rootReducer = combineReducers({
    job
});

export default rootReducer;
