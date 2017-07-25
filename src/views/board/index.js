import React, { Component, PropTypes } from 'react';
import { showErrorNotification, fetchTasks } from '../../helpers/taskFunctions';

import styles from './styles.scss';

export default class Board extends Component {
  static propTypes = {
    firebase: PropTypes.any,
    userId: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      firebaseDb: this.props.firebase.database(),
      userId: this.props.userId,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      firebaseDb: nextProps.firebase.database(),
      userId: nextProps.userId,
    });
  }

  _logout = () => {
    this.state.firebaseAuth.signOut().then(() => {
    }).catch((error) => {
      console.log(error);
      showErrorNotification(error.message);
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <button className={`btn btn-danger pull-right ${styles.logoutButton}`} onClick={this._logout}>Logout</button>
            <h1>Board</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <button className="btn btn-info pull-right add-button" onClick={this._addTaskModal}>+</button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div id="tasksContainer-todo">{fetchTasks(this.state.firebaseDb, this.state.userId)}</div>
          </div>
          <div className="col-md-4">
            <div id="tasksContainer-inprogress" />
          </div>
          <div className="col-md-4">
            <div id="tasksContainer-finished" />
          </div>
        </div>
      </div>
    );
  }
}
