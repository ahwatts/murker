/* eslint max-len: off, arrow-body-style: off */

import * as R from "ramda";

export function createNamespacedSelectors(namespace, noNsSelectors) {
  const nsLens = R.lensProp(namespace);
  return R.map((noNsSelector) => {
    return (nsState, ...args) => {
      return noNsSelector(R.view(nsLens, nsState), ...args);
    };
  }, noNsSelectors);
}

// Mostly for use in tests, as redux's combineReducers function effectively does
// this.
export function createNamespacedReducer(namespace, noNsReducer) {
  const nsLens = R.lensProp(namespace);
  return (nsState, ...args) => {
    return R.over(
      nsLens,
      (noNsState) => noNsReducer(noNsState, ...args),
      nsState,
    );
  };
}

export default {};
