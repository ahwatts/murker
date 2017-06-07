import { all } from "redux-saga/effects";
import { takeEvery, takeLatest } from "redux-saga";

import FindSong from "../redux/find_song";
import Song from "../redux/song";
import Misc from "../redux/misc";
import ReverbApi from "../reverb_api";
import { findSong } from "./song";
import { startup } from "./startup";
import { playSong } from "./play_song";

export default function* rootSaga() {
  const api = new ReverbApi("http://localhost:4567");
  yield all([
    takeLatest(Misc.Types.STARTUP, startup),
    takeLatest(FindSong.Types.FIND_SONG_QUERY, findSong, api),
    takeEvery(Song.Types.PLAY_SONG, playSong),
  ]);
}
