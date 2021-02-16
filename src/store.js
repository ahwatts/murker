/* eslint no-underscore-dangle: off */

import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./redux";
import Misc from "./redux/misc_redux";
import rootSaga from "./sagas";

export default function createMurkerStore() {
  let composeEnhancers = compose;
  if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      actionsBlacklist: [Misc.Types.UPDATE, Misc.Types.RENDER],
    });
  }

  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  );

  sagaMiddleware.run(rootSaga);

  return store;
}
