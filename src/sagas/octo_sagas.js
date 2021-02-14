import { mat4, vec3 } from "gl-matrix";

import Geometry from "../geometry";
import Mesh from "../mesh";
import Program from "../program";
import Scene from "../scene";
import unlitFragmentSrc from "../shaders/unlit.frag";
import unlitVertexSrc from "../shaders/unlit.vert";
import { getDimensions } from "../utils";

export function octo(gl) {
  const { initWidth, initHeight } = getDimensions();

  const program = new Program({
    gl,
    sources: [
      [gl.VERTEX_SHADER, unlitVertexSrc],
      [gl.FRAGMENT_SHADER, unlitFragmentSrc],
    ],
  });

  const geometry = Geometry.octohedron({ gl });
  geometry.createBuffers();

  const mesh = new Mesh({ gl, geometry, program });
  const scene = new Scene(initWidth, initHeight);
  scene.addMesh(mesh);

  return {
    update() {
      const axis = vec3.fromValues(1.0, 1.0, 1.0);
      vec3.normalize(axis, axis);
      mat4.rotate(mesh.transform, mesh.transform, (0.5 * 3.14) / 180.0, axis);
    },

    render() {
      const { width, height } = getDimensions();
      scene.setViewport(width, height);
      scene.render();
    },
  };
}

export default {};
