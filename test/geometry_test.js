/* eslint-env mocha */
/* eslint func-names: off, prefer-arrow-callback: off, no-unused-expressions: off */

import { expect } from "chai";
import Geometry from "../src/geometry";
import WebGLContext from "./webgl_fixture";

describe("With a valid WebGL Context", function () {
  let gl = null;
  let canvas = null;

  before(function () {
    return WebGLContext().then((context) => {
      gl = context.gl;
      canvas = context.canvas;
    });
  });

  after(function () {
    document.body.removeChild(canvas);
  });

  it("should have a non-nil WebGL context", function () {
    expect(gl).to.exist;
    expect(canvas).to.exist;
  });

  describe("Geometry", function () {
    it("should create a valid geometry.", function () {
      const g = new Geometry({ gl });
      expect(g).to.not.equal(null);
    });
  });
});
