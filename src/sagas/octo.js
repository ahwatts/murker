import { select, takeEvery } from "redux-saga/effects";
import { mat4, vec3 } from "gl-matrix";

import Geometry from "../geometry";
import Mesh from "../mesh";
import Misc from "../redux/misc";
import Program from "../program";
import RenderContext from "../redux/render_context";
import Scene from "../scene";
import unlitFragmentSrc from "../shaders/unlit.frag";
import unlitVertexSrc from "../shaders/unlit.vert";

function renderOcto(mesh, scene) {
  scene.render();
}

function updateOcto(mesh) {
  const axis = vec3.fromValues(1.0, 1.0, 1.0);
  vec3.normalize(axis, axis);
  mat4.rotate(mesh.transform, mesh.transform, (0.5 * 3.14) / 180.0, axis);
}

function resizeScene(scene) {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  scene.setViewport(width, height);
}

export function* runOcto() {
  const gl = yield select(RenderContext.Selectors.getGlContext);
  const { width, height } = yield select(RenderContext.Selectors.getDimensions);

  const program = new Program({
    gl,
    vertexSource: unlitVertexSrc,
    fragmentSource: unlitFragmentSrc,
  });

  const geometry = Geometry.octohedron({ gl });
  geometry.createBuffers();

  const mesh = new Mesh({ gl, geometry, program });
  const scene = new Scene(width, height);
  scene.addMesh(mesh);

  yield [
    takeEvery(Misc.Types.UPDATE, updateOcto, mesh),
    takeEvery(RenderContext.Types.RESIZE_COMPLETED, resizeScene, scene),
    takeEvery(Misc.Types.RENDER, renderOcto, mesh, scene),
  ];
}

export default {};
