import R from "ramda";
import { call, put } from "redux-saga/effects";

import FindSong from "../redux/find_song";
import Song from "../redux/song";

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

export default {};
