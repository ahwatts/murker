import { takeLatest } from "redux-saga";
import { STARTUP } from "../redux/misc";
import { startup as startupSaga } from "./startup";

export default function* rootSaga() {
  yield [
    takeLatest(STARTUP, startupSaga),
  ];
}
