import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import store from './store';
import './index.css';

ReactDOM.render(
  React.createElement(
    Provider, { store },
    React.createElement(App)),
  document.getElementById('root'),
);
