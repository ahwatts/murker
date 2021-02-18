import Immutable from "immutable";
import * as R from "ramda";
import { call, put, select } from "redux-saga/effects";
import FindSong from "../redux/search_redux";
import Song from "../redux/song_redux";
import { isBlank } from "../utils";

const AudioContext = window.AudioContext || window.webkitAudioContext;

export const FFT_SIZE = 1024;

export function* getSong(api, { songId }) {
  try {
    const response = yield call([api, "song"], songId);
    if (response.ok) {
      const body = yield call([response, "json"]);
      yield put(Song.Actions.getSongSuccess({ song: body }));
    } else {
      const error = R.path(["error", "message"], response.json());
      yield put(Song.Actions.getSongError({ error }));
    }
  } catch (e) {
    yield put(Song.Actions.getSongError({ error: e.toString() }));
  }
}

export function* findSong(api, { query }) {
  try {
    if (query.length >= 3) {
      const response = yield call([api, "findSong"], query);
      if (response.ok) {
        const body = yield call([response, "json"]);
        yield put(FindSong.Actions.findSongResults(Immutable.fromJS(body.results)));
      } else {
        const error = R.path(["error", "message"], response.json());
        yield put(FindSong.Actions.findSongError(error));
      }
    }
  } catch (e) {
    yield put(FindSong.Actions.findSongError(e.toString()));
  }
}

export function* playSong({ audio }) {
  // Attempt to re-use the previous context. By disconnecting the
  // merger node from the context's destination, the rest of the
  // previous pipeline pipeline should get gc'd once the new pipeline
  // is stored to the redux.
  const oldPipeline = (yield select(Song.Selectors.getAudioPipeline)).toJS();
  if (!isBlank(oldPipeline)) {
    oldPipeline.merger.disconnect();
  }

  const context = isBlank(oldPipeline) ? new AudioContext() : oldPipeline.context;
  const source = context.createMediaElementSource(audio);
  const splitter = context.createChannelSplitter();
  const merger = context.createChannelMerger();

  source.connect(splitter);
  const analyzers = R.times((i) => {
    const analyzer = context.createAnalyser();
    analyzer.fftSize = FFT_SIZE;
    splitter.connect(analyzer, i);
    analyzer.connect(merger, 0, i);
    return analyzer;
  }, source.channelCount);
  merger.connect(context.destination);
  audio.play();

  yield put(Song.Actions.setAudioPipeline(Immutable.fromJS({
    context, source, splitter, merger, analyzers,
  })));
}

export default {};
