import Immutable from 'immutable';
import { createStore } from 'redux';

import murker from './reducers/index';
import { createdWebGLContext } from './actions/index';

const store = createStore(murker, {
  // State values.
  gl: null,
  glOptions: {
    clearColor: [0.0, 0.0, 0.0, 1.0],
    enable: ['DEPTH_TEST'],
  },
  sceneGraph: Immutable.List([]),

  // Action creators.
  createdWebGLContext,
});

export default store;
