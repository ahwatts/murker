import Program from "../program";
import spiralFragmentSrc from "../shaders/spiral.frag";
import spiralVertexSrc from "../shaders/spiral.vert";

export function spiral(gl) {
  const program = new Program({
    gl,
    vertexSource: spiralVertexSrc,
    fragmentSource: spiralFragmentSrc,
  });
  console.log(program);
}

export default {};
