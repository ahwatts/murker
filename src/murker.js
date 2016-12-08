/* eslint no-bitwise: off */

import Shell from "./shell";
import "./murker.css";

const shell = new Shell(document.querySelector("canvas#murker"));

shell.events.on("gl-init", () => {
  const gl = shell.gl;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  shell.startRendering();
  shell.startUpdating();
});

shell.events.on("render", () => {
  const gl = shell.gl;
  gl.viewport(0, 0, shell.canvas.width, shell.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
});
