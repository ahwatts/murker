import { all } from "redux-saga/effects";
import { takeEvery, takeLatest } from "redux-saga";

import FindSong from "../redux/find_song";
import Misc from "../redux/misc";
import ReverbApi from "../reverb_api";
import Song from "../redux/song";
import { getSong, findSong } from "./song";
import { startup } from "./startup";

export default function* rootSaga() {
  const api = new ReverbApi("http://localhost:4567");
  yield all([
    takeLatest(Misc.Types.STARTUP, startup),
    takeEvery(Song.Types.MAKE_GET_SONG_REQUEST, getSong, api),
    takeLatest(FindSong.Types.FIND_SONG_QUERY, findSong, api),
  ]);
}
