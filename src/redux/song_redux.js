import Immutable from "immutable";
import R from "ramda";

const namespace = "song";

const Types = R.indexBy(R.identity, [
  "PLAY_SONG",
  "SET_AUDIO_PIPELINE",
  "SET_NOW_PLAYING_SONG",
]);

const Actions = {
  playSong: songUrl => ({ type: Types.PLAY_SONG, songUrl }),
  setAudioPipeline: nodes => ({ type: Types.SET_AUDIO_PIPELINE, nodes }),
  setNowPlayingSong: song => ({ type: Types.SET_NOW_PLAYING_SONG, song }),
};

const Reducers = {
  setAudioPipeline: (state, { nodes }) => state.merge({ pipeline: nodes }),
  setNowPlayingSong: (state, { song }) => state.merge({ nowPlaying: song }),
};

function rootReducer(state, action) {
  switch (action.type) {
  case Types.SET_AUDIO_PIPELINE:
    return Reducers.setAudioPipeline(state, action);
  case Types.SET_NOW_PLAYING_SONG:
    return Reducers.setNowPlayingSong(state, action);
  default:
    if (R.isNil(state)) {
      return Immutable.fromJS({
        pipeline: {},
        nowPlaying: null,
      });
    }
    return state;
  }
}

const Selectors = {
  getAudioPipeline(state) {
    return state[namespace].get("pipeline");
  },
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
