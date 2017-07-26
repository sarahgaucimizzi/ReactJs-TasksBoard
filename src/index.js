import 'babel-polyfill';

import React from 'react';
import { Route, IndexRoute, browserHistory, Router } from 'react-router';
import { render } from 'react-dom';
import Firebase from 'firebase';

import Login from './views/login';
import Layout from './views/layout';
import Board from './views/board';

import { CONFIG } from './config';
import './styles.scss';

const app = Firebase.initializeApp(CONFIG);

render(
  <Router history={browserHistory}>
    <Route path="/login" component={Login} firebase={app} />
    <Route path="/" component={Layout} firebase={app}>
      <IndexRoute component={Board} firebase={app} />
    </Route>
  </Router>,
  document.getElementById('app'),
);
