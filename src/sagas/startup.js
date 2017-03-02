import { put, spawn } from "redux-saga/effects";

import store from "../store";
import { RenderContextActions } from "../redux/render_context";
import { mainLoop } from "./main_loop";
import { runOcto } from "./octo";

function handleResize() {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  store.dispatch(RenderContextActions.resizeCanvas(width, height));
}

export function* startup() {
  let canvas = document.createElement("canvas");
  canvas = document.body.appendChild(canvas);
  yield put(RenderContextActions.createCanvas(canvas));

  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  yield put(RenderContextActions.resizeCanvas(width, height));
  window.addEventListener("resize", handleResize);

  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  yield put(RenderContextActions.createOpenGLContext(gl));

  yield [
    spawn(mainLoop),
    spawn(runOcto),
  ];
}

export default {};
