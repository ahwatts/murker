/* eslint no-bitwise: off */

import Shell from "./shell";
import store from "./store";
import "./murker.css";

let gl = null;
const shell = new Shell(document.querySelector("canvas#murker"));

store.subscribe(() => {
  const oldGl = gl;
  gl = store.getState().get("gl");

  if (gl !== oldGl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    shell.startRendering();
    shell.startUpdating();
  }
});

shell.events.on("render", () => {
  gl.viewport(0, 0, shell.canvas.width, shell.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
});
