import { call } from "redux-saga/effects";

export function* getSong(api, { songId }) {
  try {
    const response = yield call([api, "song"], songId);
    console.log(response);
  } catch (e) {
    console.log(e);
  }
}

export default {};
