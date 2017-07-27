import React, { Component, PropTypes } from 'react';

import 'jquery';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-notify/bootstrap-notify.min';
import 'animate.css/animate.min.css';

import Board from '../board';

export default class Layout extends Component {
  static propTypes = {
    router: PropTypes.any.isRequired,
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      firebaseAuth: this.props.router.routes[1].firebase && this.props.router.routes[1].firebase.auth(),
      firebaseDb: this.props.router.routes[1].firebase && this.props.router.routes[1].firebase.database(),
      userId: '',
    };
  }

  componentWillMount() {
    this.state.firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        // If logged in go to board
        if (this.props.location.pathname !== '/') {
          this.props.router.push('/');
        }
        this.setState({
          userId: user.uid,
        });
      } else {
        // If not logged in go to login page
        this.props.router.push('/login');
      }
    });
  }

  render() {
    return (
      <div>
        <Board userId={this.state.userId} firebase={this.props.router.routes[1].firebase} />
      </div>
    );
  }
}
