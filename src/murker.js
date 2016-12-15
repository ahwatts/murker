/* eslint no-bitwise: off */

import Geometry from "./geometry";
import Mesh from "./mesh";
import Program from "./program";
import Scene from "./scene";
import Shell from "./shell";
import "./murker.css";
import unlitVertexSrc from "./shaders/unlit.vert";
import unlitFragmentSrc from "./shaders/unlit.frag";

let gl = null;
let unlitProg = null;
let octohedronGeo = null;
let octohedronMesh = null;
const shell = new Shell(document.querySelector("canvas#murker"));
const scene = new Scene();

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
  octohedronGeo.createBuffers();

  octohedronMesh = new Mesh({ gl, geometry: octohedronGeo, program: unlitProg });
  scene.addMesh(octohedronMesh);
});

shell.events.on("render", () => {
  gl.viewport(0, 0, shell.canvas.width, shell.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  if (scene !== null) {
    scene.render();
  }
});
