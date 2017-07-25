import 'babel-polyfill';

import React from 'react';
import { Route, IndexRoute, browserHistory, Router } from 'react-router';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Firebase from 'firebase';

import configureStore from './store/configureStore';

import Login from './views/login';
import Layout from './views/layout';
import Board from './views/board';

import { CONFIG } from './config';

const store = configureStore();
const app = Firebase.initializeApp(CONFIG);

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Layout} firebase={app}>
        <IndexRoute component={Board} firebase={app} />
        <Route path="/login" component={Login} firebase={app} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app'),
);
