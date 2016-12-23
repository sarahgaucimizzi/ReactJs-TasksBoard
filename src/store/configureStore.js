/* global __DEV__*/
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import loggerMiddleware from 'redux-logger';

import rootReducer from '../redux/reducers';

export default function configureStore() {
  const middlewareList = [
    thunk,
  ];

  if (__DEV__) {
    middlewareList.push(
      loggerMiddleware({
        stateTransformer: state => (state.toJS ? state.toJS() : state),
      }),
    );
  }

  return createStore(
    rootReducer,
    applyMiddleware(...middlewareList),
  );
}
