import * as R from "ramda";
import { createNamespacedSelectors } from "../namespaced_selectors";

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
  keyDown: (state, { key }) => {
    if (!R.isNil(key)) {
      return R.set(R.lensProp(key), "down", state);
    }
    return state;
  },
  keyUp: (state, { key }) => {
    if (!R.isNil(key)) {
      return R.set(R.lensProp(key), "up", state);
    }
    return state;
  },
};

function rootReducer(state, action) {
  switch (action.type) {
  case Types.KEY_DOWN:
    return Reducers.keyDown(state, action);
  case Types.KEY_UP:
    return Reducers.keyUp(state, action);
  default:
    if (R.isNil(state)) {
      return {};
    }
    return state;
  }
}

const NoNsSelectors = {
  keyState(state, key) {
    const lens = R.lensProp(key);
    return R.defaultTo("up", R.view(lens, state));
  },

  isKeyDown(state, key) {
    const lens = R.lensProp(key);
    return R.equals(R.view(lens, state), "down");
  },
};

const Selectors = createNamespacedSelectors(namespace, NoNsSelectors);

export default {
  Types,
  Actions,
  Reducers,
  Selectors,
  namespace,
  rootReducer,
};
