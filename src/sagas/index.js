import { all, takeEvery, takeLatest } from "redux-saga/effects";

import Search from "../redux/search_redux";
import Song from "../redux/song_redux";
import Misc from "../redux/misc_redux";
import ReverbApi from "../reverb_api";
import { findSong, playSong } from "./song_sagas";
import { startup } from "./startup_sagas";

export default function* rootSaga() {
  const api = new ReverbApi("http://localhost:4567");
  yield all([
    takeLatest(Misc.Types.STARTUP, startup),
    takeLatest(Search.Types.FIND_SONG_QUERY, findSong, api),
    takeEvery(Song.Types.PLAY_SONG, playSong),
  ]);
}
