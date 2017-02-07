import { takeLatest } from "redux-saga";
import { startup } from "./startup";

export default function* rootSaga() {
  yield [
    takeLatest("STARTUP", startup),
  ];
}
