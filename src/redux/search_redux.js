import * as R from "ramda";
import { combineReducers } from "redux";
import { createNamespacedSelectors } from "../namespaced_selectors";

const namespace = "search";

const Types = R.indexBy(R.identity, [
  "FIND_SONG_QUERY",
  "FIND_SONG_RESULTS",
  "FIND_SONG_ERROR",
]);

const Actions = {
  findSongQuery: (query) => ({ type: Types.FIND_SONG_QUERY, query }),
  findSongResults: (results) => ({ type: Types.FIND_SONG_RESULTS, results }),
  findSongError: (error) => ({ type: Types.FIND_SONG_ERROR, error }),
};

const Reducers = {
  findSongQuery: (state, { query }) => R.mergeLeft(
    { fetching: true, query, error: null },
    state,
  ),
  findSongResults: (state, { results }) => R.mergeLeft(
    { fetching: false, results, error: null },
    state,
  ),
  findSongError: (state, { error }) => R.mergeLeft(
    { fetching: false, results: [], error },
    state,
  ),
};

function findSongReducer(state, action) {
  switch (action.type) {
  case Types.FIND_SONG_QUERY:
    return Reducers.findSongQuery(state, action);
  case Types.FIND_SONG_RESULTS:
    return Reducers.findSongResults(state, action);
  case Types.FIND_SONG_ERROR:
    return Reducers.findSongError(state, action);
  default:
    if (R.isNil(state)) {
      return {
        fetching: false,
        query: "",
        results: [],
        error: null,
      };
    }
    return state;
  }
}

const rootReducer = combineReducers({
  findSong: findSongReducer,
});

const NoNsSelectors = {
  getQuery: R.path(["findSong", "query"]),
  isFetching: R.path(["findSong", "fetching"]),
  getResults: R.path(["findSong", "results"]),
  getError: R.path(["findSong", "error"]),
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
