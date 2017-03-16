/* eslint no-bitwise: off, no-constant-condition: off, no-param-reassign: off */

import R from "ramda";
import { call, put, select } from "redux-saga/effects";

import Misc from "../redux/misc";
import RenderContext from "../redux/render_context";
import store from "../store";
import { getCanvas, getGlContext, isResizing } from "../redux";

const targetFrameRate = 60.0;
const targetFrameMsec = 1000.0 / targetFrameRate;

function startRender(canvas, gl, resizing) {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;

  if (resizing) {
    canvas.style = `position: fixed; top: 0; left: 0; width: ${width}; height: ${height};`;
    canvas.width = width;
    canvas.height = height;
    store.dispatch(RenderContext.Actions.resizeCompleted());
  }

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, width, height);
}

function finishRender() {
  return new Promise(requestAnimationFrame);
}

function delay(msec) {
  return new Promise(resolve => setTimeout(resolve, msec));
}

export function* mainLoop() {
  const canvas = yield select(getCanvas);
  const gl = yield select(getGlContext);
  let prevTime = performance.now();
  const times = new Float32Array(100);
  times.fill(0.0);
  let timeIndex = 0;

  let framerateDiv = document.createElement("div");
  framerateDiv = document.body.appendChild(framerateDiv);
  framerateDiv.style = "color: #FFFFFF; position: fixed; top: 1em; left: 1em; width: 5em; height: 1em;";

  while (true) {
    const frameStart = performance.now();

    yield put(Misc.Actions.update());
    const resizing = yield select(isResizing);
    yield call(startRender, canvas, gl, resizing);
    yield put(Misc.Actions.render());
    yield call(finishRender, canvas, gl, resizing);

    const frameEnd = performance.now();
    const frameMsec = frameEnd - frameStart;
    times[timeIndex] = (frameEnd - prevTime) / 1000.0;
    prevTime = frameEnd;
    timeIndex = (timeIndex + 1) % times.length;
    const frameRate = Math.round((times.length / R.sum(times)) * 100) / 100;
    framerateDiv.innerHTML = `${frameRate}`;

    yield call(delay, targetFrameMsec - frameMsec);
  }
}

export default {};
