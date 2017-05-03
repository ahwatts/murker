import React from "react";
import ReactDOM from "react-dom";
import { put, spawn } from "redux-saga/effects";

import RenderContext from "../redux/render_context";
import Root from "../components/root";
import { mainLoop } from "./main_loop";
import { runOcto } from "./octo";
import { createResizeChannel, watchResize } from "./resize";

export function* startup() {
  let canvas = document.createElement("canvas");
  canvas = document.body.appendChild(canvas);
  yield put(RenderContext.Actions.createCanvas(canvas));

  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  yield put(RenderContext.Actions.resizeCanvas(width, height));
  const resizeChannel = createResizeChannel();

  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  yield put(RenderContext.Actions.createOpenGLContext(gl));

  let chooser = document.createElement("div");
  chooser = document.body.appendChild(chooser);
  chooser.style = "position: absolute;";

  ReactDOM.render(React.createElement(Root), chooser);

  yield [
    spawn(mainLoop),
    spawn(runOcto),
    spawn(watchResize, resizeChannel),
  ];
}

export default {};
