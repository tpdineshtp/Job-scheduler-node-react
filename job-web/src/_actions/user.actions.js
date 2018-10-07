import { userConstants } from '../_constants';
import { userService } from '../_services';
import { history } from '../_helpers';

export const userActions = {
    login,
    logout
};

function login(username, password) {
    return dispatch => {
        userService.login(username, password)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/home-page');
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}
