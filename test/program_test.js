/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback,
   no-unused-expressions, import/no-extraneous-dependencies */

import { expect } from "chai";
import * as R from "ramda";
import Program from "../src/program";
import {
  manageLifetime,
  testShaderSource,
  withAValidWebGLContext,
} from "./test_utils";

describe("Program", function () {
  let gl = null;

  withAValidWebGLContext({
    contextCreated: (glParam) => {
      gl = glParam;
    },

    contextDestroyed: () => {
      gl = null;
    },

    tests: () => {
      describe("constructor initialization", function () {
        let fixture = null;

        manageLifetime({
          create: () => {
            expect(fixture).to.be.null;
            expect(gl).to.exist;
            fixture = new Program(R.merge({ gl }, testShaderSource));
          },
          destroy: () => {
            expect(fixture).to.respondTo("destroy");
            expect(gl).to.exist;
            fixture.destroy();
          },
          cleanup: () => {
            fixture = null;
          },
        });

        it("should have a program", function () {
          expect(fixture).to.have.property("program").that.is.an.instanceOf(WebGLProgram);
        });

        it("should have a list of attributes that includes position", function () {
          expect(fixture).to.have.property("attributes");
          expect(fixture.attributes).to.have.property("position").that.equals(0);
        });

        it("should have a list of uniforms that includes projection", function () {
          expect(fixture).to.have.property("uniforms");
          expect(fixture.uniforms).to.have.property("projection").that.is.an.instanceOf(WebGLUniformLocation);
        });

        it("should have a list of uniforms that includes view", function () {
          expect(fixture).to.have.property("uniforms");
          expect(fixture.uniforms).to.have.property("view").that.is.an.instanceOf(WebGLUniformLocation);
        });

        it("should have a list of uniforms that includes model", function () {
          expect(fixture).to.have.property("uniforms");
          expect(fixture.uniforms).to.have.property("model").that.is.an.instanceOf(WebGLUniformLocation);
        });
      });

      describe("destroy", function () {
        let fixture = null;

        manageLifetime({
          create: () => {
            expect(fixture).to.be.null;
            expect(gl).to.exist;
            fixture = new Program(R.merge({ gl }, testShaderSource));
          },
          destroy: () => {
            expect(fixture).to.respondTo("destroy");
            expect(gl).to.exist;
            fixture.destroy();
          },
          cleanup: () => {
            fixture = null;
          },
        });

        it("should render the WebGL program invalid", function () {
          const program = fixture.program;
          expect(program).to.be.an.instanceOf(WebGLProgram);
          expect(gl.isProgram(program)).to.be.true;
          fixture.destroy();
          expect(gl.isProgram(program)).to.be.false;
        });

        it("should render the program's shaders invalid", function () {
          const program = fixture.program;
          const shaders = gl.getAttachedShaders(program);

          expect(shaders).to.not.be.empty;
          R.forEach((s) => {
            expect(s).to.be.an.instanceOf(WebGLShader);
            expect(gl.isShader(s)).to.be.true;
          }, shaders);

          fixture.destroy();

          R.forEach((s) => {
            expect(s).to.be.an.instanceOf(WebGLShader);
            expect(gl.isShader(s)).to.be.false;
          }, shaders);
        });
      });
    },
  });
});
