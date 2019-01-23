/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import {AppNavigator, middleware} from './src/containers/AppNavigator'
import reducers from './src/reducers';

const store = createStore(
  reducers,
  __DEV__ ?
    applyMiddleware(middleware, thunkMiddleware, createLogger()) :
    applyMiddleware(middleware, thunkMiddleware)
);

export default class App extends Component<{}> {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator/>
      </Provider>
    );
  }
}
