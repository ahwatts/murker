/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback,
   no-unused-expressions, import/no-extraneous-dependencies */

import { expect } from "chai";
import { vec3 } from "gl-matrix";
import Camera from "../src/camera";

describe("Camera", function () {
  describe("constructor initialization", function () {
    context("with no args", function () {
      function fixture() {
        return new Camera();
      }

      it("should have default position, lookAt, and up attributes", function () {
        const f = fixture();
        expect(f, "f.defaultPosition").to.have.property("defaultPosition").that.is.an.instanceOf(Float32Array);
        expect(f, "f.defaultLookAt").to.have.property("defaultLookAt").that.is.an.instanceOf(Float32Array);
        expect(f, "f.defaultUp").to.have.property("defaultUp").that.is.an.instanceOf(Float32Array);
      });

      it("should have position, lookAt, and up attributes that are equal to the defaults", function () {
        const f = fixture();
        expect(f, "fixture.position").to.have.property("position").that.deep.equals(f.defaultPosition);
        expect(f, "fixture.lookAt").to.have.property("lookAt").that.deep.equals(f.defaultLookAt);
        expect(f, "fixture.up").to.have.property("up").that.deep.equals(f.defaultUp);
      });
    });

    context("with args", function () {
      it("should have position, lookAt, and up attributes that match those passed in", function () {
        const f = new Camera({
          position: [0.0, 5.0, 0.0],
          lookAt: [0.0, -1.0, 0.0],
          up: [1.0, 0.0, 0.0],
        });

        const pos = vec3.fromValues(0.0, 5.0, 0.0);
        const lat = vec3.fromValues(0.0, -1.0, 0.0);
        const up = vec3.fromValues(1.0, 0.0, 0.0);

        expect(f.position, "f.position").to.be.an.instanceOf(Float32Array).and.to.deep.equal(pos);
        expect(f.lookAt, "f.lookAt").to.be.an.instanceOf(Float32Array).and.to.deep.equal(lat);
        expect(f.up, "f.up").to.be.an.instanceOf(Float32Array).and.to.deep.equal(up);
      });
    });
  });

  describe("reset", function () {
    it("should reset the position, lookAt, and up attributes to the defaults", function () {
      const c = new Camera({
        position: [0.0, 5.0, 0.0],
        lookAt: [0.0, -1.0, 0.0],
        up: [1.0, 0.0, 0.0],
      });

      c.reset();

      expect(c.position, "c.position").to.be.an.instanceOf(Float32Array).and.to.deep.equal(c.defaultPosition);
      expect(c.lookAt, "c.lookAt").to.be.an.instanceOf(Float32Array).and.to.deep.equal(c.defaultLookAt);
      expect(c.up, "c.up").to.be.an.instanceOf(Float32Array).and.to.deep.equal(c.defaultUp);
    });
  });
});
