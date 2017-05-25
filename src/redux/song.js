import Immutable from "immutable";
import R from "ramda";

const namespace = "song";

const Types = R.indexBy(R.identity, [
  // "MAKE_GET_SONG_REQUEST",
  // "GET_SONG_SUCCESS",
  // "GET_SONG_ERROR",
  "SET_NOW_PLAYING_SONG",
]);

const Actions = {
  // makeGetSongRequest: id => ({ type: Types.MAKE_GET_SONG_REQUEST, songId: id }),
  // getSongSuccess: song => ({ type: Types.GET_SONG_SUCCESS, song }),
  // getSongError: error => ({ type: Types.GET_SONG_ERROR, error }),
  setNowPlayingSong: song => ({ type: Types.SET_NOW_PLAYING_SONG, song }),
};

const Reducers = {
  // eslint-disable-next-line max-len
  // makeGetSongRequest: (state, { id }) => state.merge({ fetching: true, error: null, song: { id } }),
  // getSongSuccess: (state, { song }) => state.merge({ fetching: false, error: null, song }),
  // getSongError: (state, { error }) => state.merge({ fetching: false, error, song: null }),
  setNowPlayingSong: (state, { song }) => state.merge({ nowPlaying: song }),
};

function rootReducer(state, action) {
  switch (action.type) {
  // case Types.MAKE_GET_SONG_REQUEST:
  //   return Reducers.makeGetSongRequest(state, action);
  // case Types.GET_SONG_SUCCESS:
  //   return Reducers.getSongSuccess(state, action);
  // case Types.GET_SONG_ERROR:
  //   return Reducers.getSongError(state, action);
  case Types.SET_NOW_PLAYING_SONG:
    return Reducers.setNowPlayingSong(state, action);
  default:
    if (R.isNil(state)) {
      return Immutable.fromJS({
        // fetching: false,
        // error: null,
        // song: null,
        nowPlaying: null,
      });
    }
    return state;
  }
}

const Selectors = {
  getNowPlayingSong(state) {
    return state[namespace].get("nowPlaying");
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
