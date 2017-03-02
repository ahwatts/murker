import { select, takeEvery } from "redux-saga/effects";
import { mat4, vec3 } from "gl-matrix";

// import Camera from "../camera";
import Geometry from "../geometry";
import Mesh from "../mesh";
import Program from "../program";
import Scene from "../scene";
import unlitFragmentSrc from "../shaders/unlit.frag";
import unlitVertexSrc from "../shaders/unlit.vert";
import { RESIZE_COMPLETED } from "../redux/render_context";
import { getDimensions, getGlContext } from "../redux";
import { RENDER, UPDATE } from "../redux/misc";

function renderOcto(mesh, scene) {
  scene.render();
}

function updateOcto(mesh) {
  const axis = vec3.fromValues(1.0, 1.0, 1.0);
  vec3.normalize(axis, axis);
  mat4.rotate(mesh.transform, mesh.transform, (1.0 * 3.14) / 180.0, axis);
}

function resizeScene(scene) {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  scene.setViewport(width, height);
}

export function* runOcto() {
  const gl = yield select(getGlContext);
  const { width, height } = yield select(getDimensions);

  const program = new Program({
    gl,
    vertexSource: unlitVertexSrc,
    fragmentSource: unlitFragmentSrc,
  });
  // yield put(SceneGraphActions.createProgram("unlit", unlitProg));

  const geometry = Geometry.octohedron({ gl });
  geometry.createBuffers();
  // yield put(SceneGraphActions.createGeometry("octohedron", octohedronGeo));

  const mesh = new Mesh({ gl, geometry, program });
  const scene = new Scene(width, height);
  scene.addMesh(mesh);

  yield [
    takeEvery(UPDATE, updateOcto, mesh),
    takeEvery(RESIZE_COMPLETED, resizeScene, scene),
    takeEvery(RENDER, renderOcto, mesh, scene),
  ];
}

export default {};
