/* eslint no-bitwise: off */

import Geometry from "./geometry";
import Mesh from "./mesh";
import Program from "./program";
import Shell from "./shell";
import "./murker.css";
import unlitVertexSrc from "./shaders/unlit.vert";
import unlitFragmentSrc from "./shaders/unlit.frag";

let gl = null;
let unlitProg = null;
let octohedronGeo = null;
let octohedronMesh = null;
const shell = new Shell(document.querySelector("canvas#murker"));

shell.events.on("gl-init", () => {
  gl = shell.gl;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  shell.startRendering();
  shell.startUpdating();

  unlitProg = new Program({
    gl,
    vertexSource: unlitVertexSrc,
    fragmentSource: unlitFragmentSrc,
  });

  octohedronGeo = Geometry.octohedron({ gl });

  octohedronMesh = new Mesh({ gl, geometry: octohedronGeo, program: unlitProg });
});

shell.events.on("render", () => {
  gl.viewport(0, 0, shell.canvas.width, shell.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
});
