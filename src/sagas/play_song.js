import { call } from "redux-saga/effects";

export function* playSong(songUrl) {
  const response = yield call(fetch, songUrl);
  console.log({ response });
}

export default {};
