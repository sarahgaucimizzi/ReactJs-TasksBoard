import React, { Component, PropTypes } from 'react';

import 'jquery';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-notify/bootstrap-notify.min';
import 'animate.css/animate.min.css';

export default class Layout extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
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
        this.state.userId = user.uid;
        if (this.props.location.pathname !== '/') {
          this.props.router.push('/');
        }
      } else {
        this.props.router.push('/login');
      }
    });
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
