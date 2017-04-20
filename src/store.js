/* eslint no-underscore-dangle: off */

import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware, compose } from "redux";

import rootReducer from "./redux";
import rootSaga from "./sagas";
import { UPDATE, RENDER } from "./redux/misc";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
  actionsBlacklist: [UPDATE, RENDER],
}) || compose;
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(rootSaga);

export default store;
