/* eslint no-constant-condition: off */

import { eventChannel } from "redux-saga";
import { put, take } from "redux-saga/effects";

import RenderContext from "../redux/render_context";

export function createResizeChannel() {
  return eventChannel((emit) => {
    function listener() {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;
      emit({ width, height });
    }

    window.addEventListener("resize", listener);

    return () => {
      window.removeEventListener("resize", listener);
    };
  });
}

export function* watchResize(channel) {
  while (true) {
    const { width, height } = yield take(channel);
    yield put(RenderContext.Actions.resizeCanvas(width, height));
  }
}

export default {};
