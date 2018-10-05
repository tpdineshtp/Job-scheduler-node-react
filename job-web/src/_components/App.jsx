import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from '../_helpers';

import { PrivateRoute } from './PrivateRoute';
import { HomePage } from './HomePage.jsx';
import '../_assets/styles.css'

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (

            <Router history={history}>
                <div>
                    <Route path="/home-page" component={HomePage} />
                </div>
            </Router>
      );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App };
