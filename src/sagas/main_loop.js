/* eslint no-bitwise: off */

import { select } from "redux-saga/effects";
import { getGlContext } from "../redux";

export function* startMainLoop() {
  const gl = yield select(getGlContext);

  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    requestAnimationFrame(render);
  }

  render();
}

export default {};
