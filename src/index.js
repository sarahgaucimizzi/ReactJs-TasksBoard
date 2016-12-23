import 'babel-polyfill';

import React from 'react';
import { Route, IndexRoute, browserHistory, Router } from 'react-router';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';

import Layout from './views/layout';
import HomePage from './views/home';

const store = configureStore();

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Layout}>
        <IndexRoute component={HomePage} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app'),
);
