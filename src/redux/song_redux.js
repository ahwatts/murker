import * as R from "ramda";
import { createNamespacedSelectors } from "../namespaced_selectors";

const namespace = "song";

const Types = R.indexBy(R.identity, [
  "PLAY_SONG",
  "SET_AUDIO_PIPELINE",
  "SET_NOW_PLAYING_SONG",
]);

const Actions = {
  playSong: (song, audio) => ({ type: Types.PLAY_SONG, song, audio }),
  setAudioPipeline: (nodes) => ({ type: Types.SET_AUDIO_PIPELINE, nodes }),
  setNowPlayingSong: (song) => ({ type: Types.SET_NOW_PLAYING_SONG, song }),
};

const Reducers = {
  setAudioPipeline: (state, { nodes }) => R.assoc("pipeline", nodes, state),
  setNowPlayingSong: (state, { song }) => R.assoc("nowPlaying", song, state),
};

function rootReducer(state, action) {
  switch (action.type) {
  case Types.SET_AUDIO_PIPELINE:
    return Reducers.setAudioPipeline(state, action);
  case Types.SET_NOW_PLAYING_SONG:
    return Reducers.setNowPlayingSong(state, action);
  default:
    if (R.isNil(state)) {
      return {
        pipeline: {},
        nowPlaying: null,
      };
    }
    return state;
  }
}

const NoNsSelectors = {
  getAudioPipeline: R.prop("pipeline"),
  getNowPlayingSong: R.prop("nowPlaying"),
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
