import Immutable from "immutable";
import R from "ramda";

const namespace = "findSong";

const Types = R.indexBy(R.identity, [
  "FIND_SONG_QUERY",
  "FIND_SONG_RESULTS",
  "FIND_SONG_ERROR",
]);

const Actions = {
  findSongQuery: query => ({ type: Types.FIND_SONG_QUERY, query }),
  findSongResults: results => ({ type: Types.FIND_SONG_RESULTS, results }),
  findSongError: error => ({ type: Types.FIND_SONG_ERROR, error }),
};

const Reducers = {
  findSongQuery: (state, { query }) => state.update("findSong", state2 => (
    state2.merge({ fetching: true, query })
  )),
  findSongResults: (state, { results }) => state.update("findSong", state2 => (
    state2.merge({ fetching: false, results })
  )),
  findSongError: (state, { error }) => state.update("findSong", state2 => (
    state2.merge({ fetching: false, results: [], error })
  )),
};

function rootReducer(state, action) {
  switch (action.type) {
  case Types.FIND_SONG_QUERY:
    return Reducers.findSongQuery(state, action);
  case Types.FIND_SONG_RESULTS:
    return Reducers.findSongResults(state, action);
  case Types.FIND_SONG_ERROR:
    return Reducers.findSongError(state, action);
  default:
    if (R.isNil(state)) {
      return Immutable.fromJS({
        findSong: {
          fetching: false,
          query: "",
          results: [],
          error: null,
        },
      });
    }
    return state;
  }
}

const Selectors = {
  getQuery(state) {
    return state[namespace].getIn(["findSong", "query"]);
  },

  isFetching(state) {
    return state[namespace].getIn(["findSong", "fetching"]);
  },

  getResults(state) {
    return state[namespace].getIn(["findSong", "results"]);
  },

  getError(state) {
    return state[namespace].getIn(["findSong", "error"]);
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
