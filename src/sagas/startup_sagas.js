import { put, spawn } from "redux-saga/effects";
import RenderContext from "../redux/render_context_redux";
import { createKeyPressChannel, watchKeyPresses } from "./keypress_sagas";
import { startMainLoop } from "./main_loop_sagas";
import { createResizeChannel, watchResize } from "./resize_sagas";
import { spiral } from "./spiral_sagas";

// import { octo } from "./octo_sagas";
// import { particles } from "./particle_sagas";

export function* startup({ canvas, store }) {
  yield put(RenderContext.Actions.createCanvas(canvas));

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
  const { update, render } = spiral(store, gl);
  startMainLoop(canvas, store, gl, update, render);
}

export default {};
