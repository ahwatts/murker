/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback,
   no-unused-expressions, import/no-extraneous-dependencies */

import { expect } from "chai";
import R from "ramda";
import Camera from "../src/camera";
import Geometry from "../src/geometry";
import Mesh from "../src/mesh";
import Program from "../src/program";
import Scene from "../src/scene";
import {
  withAValidWebGLContext,
  manageLifetime,
  octohedronPolyData,
  testShaderSource,
} from "./test_utils";

describe("Scene", function () {
  describe("constructor initialization", function () {
    function fixture() {
      return new Scene(640, 480);
    }

    it("should have a camera", function () {
      expect(fixture()).to.have.property("camera").that.is.an.instanceOf(Camera);
    });

    it("should have an empty mesh list", function () {
      expect(fixture()).to.have.property("meshes").that.is.empty;
    });

    it("should have a projection matrix", function () {
      expect(fixture()).to.have.property("projection").that.is.an.instanceOf(Float32Array);
    });

    it("should have a viewport", function () {
      const f = fixture();
      expect(f.viewport.width).to.equal(640);
      expect(f.viewport.height).to.equal(480);
    });
  });

  let gl = null;
  withAValidWebGLContext({
    contextCreated: (glParam) => {
      gl = glParam;
    },

    contextDestroyed: () => {
      gl = null;
    },

    tests: () => {
      const fixtureData = {
        geometry: null,
        program: null,
        mesh: null,
      };

      manageLifetime({
        create: () => {
          expect(fixtureData.geometry, "Geometry fixture").to.be.null;
          expect(fixtureData.program, "Program fixture").to.be.null;
          expect(fixtureData.mesh, "Mesh fixture").to.be.null;
          expect(gl).to.exist;
          fixtureData.geometry = new Geometry(R.merge({ gl }, octohedronPolyData));
          fixtureData.program = new Program(R.merge({ gl }, testShaderSource));
          fixtureData.mesh = new Mesh(R.merge({ gl }, fixtureData));
        },
        destroy: () => {
          expect(fixtureData.geometry, "Geometry fixture").to.respondTo("destroy");
          expect(fixtureData.program, "Program fixture").to.respondTo("destroy");
          if (fixtureData.geometry !== null) {
            fixtureData.geometry.destroy();
          }
          if (fixtureData.program !== null) {
            fixtureData.program.destroy();
          }
        },
        cleanup: () => {
          fixtureData.geometry = null;
          fixtureData.program = null;
          fixtureData.mesh = null;
        },
      });

      function fixture() {
        return new Scene(640, 480);
      }

      describe("addMesh", function () {
        it("should add a mesh to the list", function () {
          const f = fixture();
          expect(f.meshes).to.be.empty;
          f.addMesh(fixtureData.mesh);
          expect(f.meshes.length).to.equal(1);
        });
      });
    },
  });
});
