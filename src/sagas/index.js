import { takeEvery, takeLatest } from "redux-saga";

import Misc from "../redux/misc";
import ReverbApi from "../reverb_api";
import Song from "../redux/song";
import { getSong } from "./songs";
import { startup } from "./startup";

export default function* rootSaga() {
  const api = new ReverbApi("https://www.soniclemur.com/api");
  yield [
    takeLatest(Misc.Types.STARTUP, startup),
    takeEvery(Song.Types.GET_SONG_REQUEST, getSong, api),
  ];
}
