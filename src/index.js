import { Provider } from 'react-redux';
import { createStore } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import murker from './reducers/index';
import { createdWebGLContext } from './actions/index';
import './index.css';

const store = createStore(murker, {
  gl: null,
  createdWebGLContext,
});

ReactDOM.render(
  React.createElement(
    Provider, { store },
    React.createElement(App)),
  document.getElementById('root'),
);
