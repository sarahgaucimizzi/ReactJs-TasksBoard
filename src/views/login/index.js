import React, { Component, PropTypes } from 'react';

export default class Login extends Component {
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
    this.state.firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        this.props.router.push({ pathname: '/', state: { userId: user.uid } });
      }
    });
  }

  _handleEmailChange = (event) => {
    this.setState({
      email: event.target.value,
    });
  }

  _handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value,
    });
  }

  _loginRegister = () => {
    // Try login
    this.state.firebaseAuth.signInWithEmailAndPassword(this.state.email.toString(), this.state.password.toString())
        .catch((loginerror) => {
          if (loginerror.code === 'auth/user-not-found') {
            // Register
            this.state.firebaseAuth.createUserWithEmailAndPassword(this.state.email, this.state.password)
                .catch((registererror) => {
                  this._showErrorNotification(registererror.message);
                });
          } else {
            this._showErrorNotification(loginerror.message);
          }
        });

    return false;
  }

  _showErrorNotification(errorMessage) {
    $.notify({
      // options
      icon: 'glyphicon glyphicon-warning-sign',
      title: 'ERROR',
      message: `Message received from server:  ${errorMessage}`,
    }, {
      // settings
      type: 'danger',
      allow_dismiss: true,
      newest_on_top: false,
      showProgressbar: false,
      placement: {
        from: 'bottom',
        align: 'right',
      },
      offset: 20,
      spacing: 10,
      z_index: 1051,
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp',
      },
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <h1>Login or Create an Account</h1>
            <div id="loginForm">
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" name="email" placeholder="Email" value={this.state.email} onChange={this._handleEmailChange} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" name="password" placeholder="Password" value={this.state.password} onChange={this._handlePasswordChange} />
              </div>
              <button onClick={this._loginRegister} className="btn btn-default">Login</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
