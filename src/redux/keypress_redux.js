import Immutable from "immutable";
import * as R from "ramda";

const namespace = "keyPress";

const Types = R.indexBy(R.identity, [
  "KEY_DOWN",
  "KEY_UP",
]);

const Actions = {
  keyDown: (key) => ({ type: Types.KEY_DOWN, key }),
  keyUp: (key) => ({ type: Types.KEY_UP, key }),
};

const Reducers = {
  keyDown: (state, { key }) => state.merge({ [key]: "down" }),
  keyUp: (state, { key }) => state.delete(key),
};

function rootReducer(state, action) {
  switch (action.type) {
  case Types.KEY_DOWN:
    return Reducers.keyDown(state, action);
  case Types.KEY_UP:
    return Reducers.keyUp(state, action);
  default:
    if (R.isNil(state)) {
      return Immutable.Map();
    }
    return state;
  }
}

const Selectors = {
  isKeyDown(state, key) {
    return (state[namespace] || Immutable.Map()).get(key);
  },
};

export default {
  Types,
  Actions,
  Reducers,
  Selectors,
  namespace,
  rootReducer,
};
