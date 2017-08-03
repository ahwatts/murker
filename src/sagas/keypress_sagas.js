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
    // console.log(keyEvent);
    if (keyEvent.type === "keydown") {
      yield put(KeyPress.Actions.keyDown(keyEvent.key));
    } else if (keyEvent.type === "keyup") {
      yield put(KeyPress.Actions.keyUp(keyEvent.key));
    }
  }
}

export default {};
