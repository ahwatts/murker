import { put } from "redux-saga/effects";
import Geometry from "../geometry";
import Program from "../program";
import unlitFragmentSrc from "../shaders/unlit.frag";
import unlitVertexSrc from "../shaders/unlit.vert";
import { RenderContextActions } from "../redux/render_context";
import { SceneGraphActions } from "../redux/scene_graph";

export function* startup() {
  let canvas = document.createElement("canvas");
  canvas = document.body.appendChild(canvas);
  yield put(RenderContextActions.createCanvas(canvas));

  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  yield put(RenderContextActions.createOpenGLContext(gl));

  const unlitProg = new Program({
    gl,
    vertexSource: unlitVertexSrc,
    fragmentSource: unlitFragmentSrc,
  });
  yield put(SceneGraphActions.createProgram("unlit", unlitProg));

  const octohedronGeo = Geometry.octohedron({ gl });
  octohedronGeo.createBuffers();
  yield put(SceneGraphActions.createGeometry("octohedron", octohedronGeo));
}

export default {};
