/* eslint no-bitwise: off */

import "./murker.css";
import Geometry from "./geometry";
import Mesh from "./mesh";
import Player from "./player";
import Program from "./program";
import ReverbApi from "./reverb_api";
import Scene from "./scene";
import Shell from "./shell";
import unlitFragmentSrc from "./shaders/unlit.frag";
import unlitVertexSrc from "./shaders/unlit.vert";

let gl = null;
let unlitProg = null;
let octohedronGeo = null;
let octohedronMesh = null;
let scene = null;

let canvas = document.createElement("canvas");
canvas = document.body.appendChild(canvas);
const shell = new Shell(canvas);

shell.events.on("gl-init", () => {
  gl = shell.gl;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  scene = new Scene(shell.canvas.width, shell.canvas.height);

  unlitProg = new Program({
    gl,
    vertexSource: unlitVertexSrc,
    fragmentSource: unlitFragmentSrc,
  });

  octohedronGeo = Geometry.octohedron({ gl });
  octohedronGeo.createBuffers();

  octohedronMesh = new Mesh({ gl, geometry: octohedronGeo, program: unlitProg });
  scene.addMesh(octohedronMesh);

  shell.startRendering();
  shell.startUpdating();

  const api = new ReverbApi("https://local.tunehive.com/api");
  api.artistSongs(3193).then((songsPage) => {
    if (songsPage.pagination.result_count > 0) {
      let audio = document.createElement("audio");
      audio.style.setProperty("display", "none");
      audio.src = songsPage.results[0].url;
      audio = document.body.appendChild(audio);
      const player = new Player(audio);
      player.play();
    }
  });
});

shell.events.on("resized", (width, height) => {
  if (scene !== null) {
    scene.setViewport(width, height);
  }
});

shell.events.on("render", () => {
  gl.viewport(0, 0, shell.canvas.width, shell.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  if (scene !== null) {
    scene.render();
  }
});
