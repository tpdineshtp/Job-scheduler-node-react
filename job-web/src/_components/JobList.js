import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {jobActions } from '../_actions'

class JobList extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
        <React.Fragment>
          <p> Yet to be implemented! </p>
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

const connectedJobList = connect(mapStateToProps)(JobList);
export { connectedJobList as JobList };
