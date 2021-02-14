import React from "react";
import ReactDOM from "react-dom";
import { put, spawn } from "redux-saga/effects";

import RenderContext from "../redux/render_context_redux";
import Root from "../components/root";
import { createKeyPressChannel, watchKeyPresses } from "./keypress_sagas";
import { createResizeChannel, watchResize } from "./resize_sagas";
// import { octo } from "./octo_sagas";
// import { particles } from "./particle_sagas";
import { spiral } from "./spiral_sagas";
import { startMainLoop } from "./main_loop_sagas";

export function* startup() {
  let canvas = document.createElement("canvas");
  canvas = document.body.appendChild(canvas);
  yield put(RenderContext.Actions.createCanvas(canvas));

  let chooser = document.createElement("div");
  chooser = document.body.appendChild(chooser);
  ReactDOM.render(React.createElement(Root), chooser);

  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  yield put(RenderContext.Actions.resizeCanvas(width, height));
  const resizeChannel = createResizeChannel();
  yield spawn(watchResize, resizeChannel);

  const keyPressChannel = createKeyPressChannel();
  yield spawn(watchKeyPresses, keyPressChannel);

  const gl = canvas.getContext("webgl2");
  yield put(RenderContext.Actions.createOpenGLContext(gl));
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // const { update, render } = octo(gl);
  // const { update, render } = particles(gl);
  const { update, render } = spiral(gl);
  startMainLoop(canvas, gl, update, render);
}

export default {};
