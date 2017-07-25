import React, { Component, PropTypes } from 'react';
import { showErrorNotification } from '../../helpers/taskFunctions';

import styles from './style.scss';

export default class HomePage extends Component {
  static propTypes = {
    router: PropTypes.any.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      firebaseAuth: this.props.router.routes[1].firebase && this.props.router.routes[1].firebase.auth(),
      email: '',
      password: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      firebaseAuth: nextProps.router.routes[1].firebase.auth(),
    });
  }

  _logout = () => {
    this.state.firebaseAuth.signOut().then(() => {
      console.log('logged out');
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
            <div id="tasksContainer-todo" />
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
