/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback,
   no-unused-expressions, import/no-extraneous-dependencies,
   key-spacing */

import { expect } from "chai";
import WebGLContext from "./webgl_fixture";
import testVertexShaderSource from "./shaders/test.vert";
import testFragmentShaderSource from "./shaders/test.frag";

export function withAValidWebGLContext({ contextCreated, contextDestroyed, tests }) {
  describe("With a valid WebGL Context", function () {
    let gl = null;
    let canvas = null;

    before(function () {
      return WebGLContext().then((context) => {
        gl = context.gl;
        canvas = context.canvas;
        contextCreated(gl, canvas);
      });
    });

    after(function () {
      contextDestroyed();
      document.body.removeChild(canvas);
      gl = null;
      canvas = null;
    });

    it("should have a non-nil WebGL context", function () {
      expect(gl).to.exist;
      expect(canvas).to.exist;
    });

    tests();
  });
}

export function manageLifetime({ create, destroy, cleanup }) {
  beforeEach(create);

  afterEach(function () {
    try {
      destroy();
    } finally {
      cleanup();
    }
  });
}

export const octohedronPolyData = {
  vertex: [
    { x:  1.0, y:  0.0, z:  0.0, red: 1.0, green: 0.0, blue: 0.0, alpha: 1.0 },
    { x: -1.0, y:  0.0, z:  0.0, red: 1.0, green: 0.0, blue: 0.0, alpha: 1.0 },
    { x:  0.0, y:  0.0, z:  1.0, red: 0.0, green: 0.0, blue: 1.0, alpha: 1.0 },
    { x:  0.0, y:  0.0, z: -1.0, red: 0.0, green: 0.0, blue: 1.0, alpha: 1.0 },
    { x:  0.0, y: -1.0, z:  0.0, red: 0.0, green: 1.0, blue: 0.0, alpha: 1.0 },
    { x:  0.0, y:  1.0, z:  0.0, red: 0.0, green: 1.0, blue: 0.0, alpha: 1.0 },
  ],
  face: [
    [4, 0, 2],
    [4, 3, 0],
    [4, 1, 3],
    [4, 2, 1],
    [5, 2, 0],
    [5, 0, 3],
    [5, 3, 1],
    [5, 1, 2],
  ],
};

export const testShaderSource = {
  vertexSource: testVertexShaderSource,
  fragmentSource: testFragmentShaderSource,
};

export default {};
