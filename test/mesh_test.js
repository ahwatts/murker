/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback,
   no-unused-expressions, import/no-extraneous-dependencies */

import { expect } from "chai";
import R from "ramda";
import { mat4 } from "gl-matrix";
import Geometry from "../src/geometry";
import Mesh from "../src/mesh";
import Program from "../src/program";
import {
  manageLifetime,
  octohedronPolyData,
  testShaderSource,
  withAValidWebGLContext,
} from "./test_utils";

describe("Mesh", function () {
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
      };

      manageLifetime({
        create: () => {
          expect(fixtureData.geometry, "Geometry fixture").to.be.null;
          expect(fixtureData.program, "Program fixture").to.be.null;
          expect(gl).to.exist;
          fixtureData.geometry = new Geometry(R.merge({ gl }, octohedronPolyData));
          fixtureData.program = new Program(R.merge({ gl }, testShaderSource));
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
        },
      });

      function fixture() {
        return new Mesh(R.merge({ gl }, fixtureData));
      }

      describe("constructor initialization", function () {
        it("should return a non-null Mesh object", function () {
          expect(fixture()).to.exist.and.not.be.null;
        });

        it("should have a geometry member", function () {
          expect(fixture()).to.have.property("geometry").that.is.an.instanceOf(Geometry);
        });

        it("should have a program member", function () {
          expect(fixture()).to.have.property("program").that.is.an.instanceOf(Program);
        });

        it("should have a transform member", function () {
          // gl-matrix says that mat4.create() returns an identity
          // matrix, but just to be sure..
          const identity = mat4.create();
          mat4.identity(identity);
          expect(fixture()).to.have.property("transform").that.deep.equals(identity);
        });
      });

      describe("render", function () {
        describe("bindProgram", function () {
          it("should set the program", function () {
            const m = fixture();
            expect(gl.getParameter(gl.CURRENT_PROGRAM)).to.be.null;
            m.bindProgram();
            expect(gl.getParameter(gl.CURRENT_PROGRAM)).to.be.an.instanceOf(WebGLProgram);
          });
        });

        describe("unbindProgram", function () {
          it("should un-set the program", function () {
            const m = fixture();
            gl.useProgram(m.program.program);
            expect(gl.getParameter(gl.CURRENT_PROGRAM)).to.be.an.instanceOf(WebGLProgram);
            m.unbindProgram();
            expect(gl.getParameter(gl.CURRENT_PROGRAM)).to.be.null;
          });
        });

        describe("setUpUniforms", function () {
          it("should set up the projection uniform", function () {
            const m = fixture();
            m.bindProgram();
            m.setUpUniforms({
              projection: mat4.create(),
              view: mat4.create(),
              model: mat4.create(),
            });
            expect(gl.getUniform(m.program.program, m.program.uniforms.projection)).to.not.be.null;
          });

          it("should set up the view uniform", function () {
            const m = fixture();
            m.bindProgram();
            m.setUpUniforms({
              projection: mat4.create(),
              view: mat4.create(),
              model: mat4.create(),
            });
            expect(gl.getUniform(m.program.program, m.program.uniforms.view)).to.not.be.null;
          });

          it("should set up the model uniform", function () {
            const m = fixture();
            m.bindProgram();
            m.setUpUniforms({
              projection: mat4.create(),
              view: mat4.create(),
              model: mat4.create(),
            });
            expect(gl.getUniform(m.program.program, m.program.uniforms.model)).to.not.be.null;
          });
        });
      });
    },
  });
});
