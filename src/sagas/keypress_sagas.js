/* eslint no-constant-condition: off */

import { eventChannel } from "redux-saga";
import { put, take } from "redux-saga/effects";

import KeyPress from "../redux/keypress_redux";

export function createKeyPressChannel() {
  return eventChannel((emit) => {
    function listener(event) {
      emit(event);
    }

    // window.addEventListener("keypress", listener);
    window.addEventListener("keydown", listener);
    window.addEventListener("keyup", listener);

    return () => {
      // window.removeEventListener("keypress", listener);
      window.removeEventListener("keydown", listener);
      window.removeEventListener("keyup", listener);
    };
  });
}

export function* watchKeyPresses(channel) {
  while (true) {
    const keyEvent = yield take(channel);
    const { type, code } = keyEvent;
    if (type === "keydown") {
      yield put(KeyPress.Actions.keyDown(code));
    } else if (type === "keyup") {
      yield put(KeyPress.Actions.keyUp(code));
    }
  }
}

export default {};
