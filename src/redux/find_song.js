import Immutable from "immutable";
import R from "ramda";

const namespace = "findSong";

const Types = R.indexBy(R.identity, [
  "FIND_SONG_QUERY",
  "FIND_SONG_RESULTS",
]);

const Actions = {
  findSongQuery: query => ({ type: Types.FIND_SONG_QUERY, query }),
  findSongResults: results => ({ type: Types.FIND_SONG_RESULTS, results }),
};

const Reducers = {
  findSongQuery: (state, { query }) => state.merge({ fetching: true, query, results: [] }),
  findSongResults: (state, { results }) => state.merge({ fetching: false, results }),
};

function rootReducer(state, action) {
  switch (action.type) {
  case Types.FIND_SONG_QUERY:
    return Reducers.findSongQuery(state, action);
  case Types.FIND_SONG_RESULTS:
    return Reducers.findSongResults(state, action);
  default:
    if (R.isNil(state)) {
      return Immutable.Map({
        fetching: false,
        query: "",
        results: Immutable.List([]),
      });
    }
    return state;
  }
}

const Selectors = {
  getQuery(state) {
    return state[namespace].get("query");
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
