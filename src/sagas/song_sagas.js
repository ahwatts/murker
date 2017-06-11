import R from "ramda";
import { call, put, select } from "redux-saga/effects";

import FindSong from "../redux/search_redux";
import Song from "../redux/song_redux";

const AudioContext = window.AudioContext || window.webkitAudioContext;

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
        yield put(FindSong.Actions.findSongResults(body.results));
      } else {
        const error = R.path(["error", "message"], response.json());
        yield put(FindSong.Actions.findSongError(error));
      }
    }
  } catch (e) {
    yield put(FindSong.Actions.findSongError(e.toString()));
  }
}

export function* playSong({ songUrl }) {
  const context = new AudioContext();
  const response = yield call(fetch, songUrl);

  if (!response.ok) {
    // handle error
    return;
  }

  const rawData = yield call([response, "arrayBuffer"]);
  const decodedData = yield call([context, "decodeAudioData"], rawData);

  const source = context.createBufferSource();
  source.buffer = decodedData;

  const splitter = context.createChannelSplitter();
  const merger = context.createChannelMerger();

  source.connect(splitter);
  const analyzers = R.times((i) => {
    const analyzer = context.createAnalyser();
    splitter.connect(analyzer, i);
    analyzer.connect(merger, 0, i);
    return analyzer;
  }, source.channelCount);
  merger.connect(context.destination);
  source.start();

  yield put(Song.Actions.setAudioPipeline({
    context, source, splitter, merger, analyzers,
  }));
}

export default {};
