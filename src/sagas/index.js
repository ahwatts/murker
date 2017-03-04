import { takeLatest } from "redux-saga";

import Misc from "../redux/misc";
import { startup } from "./startup";

export default function* rootSaga() {
  yield [
    takeLatest(Misc.Types.STARTUP, startup),
  ];
}
