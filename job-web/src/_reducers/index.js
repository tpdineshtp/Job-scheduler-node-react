import { combineReducers } from 'redux';

import { job } from './job.reducer';
import { user } from './user.reducer';


const rootReducer = combineReducers({
    job,
    user
});

export default rootReducer;
