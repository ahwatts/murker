/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback,
   no-unused-expressions, import/no-extraneous-dependencies */

import { expect } from "chai";
import * as R from "ramda";
import Geometry from "../src/geometry";
import Program from "../src/program";
import {
  manageLifetime,
  octohedronPolyData,
  testShaderSource,
  withAValidWebGLContext,
} from "./test_utils";

describe("Geometry", function () {
  let gl = null;

  withAValidWebGLContext({
    contextCreated: (glParam) => {
      gl = glParam;
    },

    contextDestroyed: () => {
      gl = null;
    },

    tests: () => {
      function vertexDataExpectations(geoFn) {
        it("should have an elements member that is an array of numbers", function () {
          const geo = geoFn();
          expect(geo).to.have.property("elements");
          expect(geo.elements).to.exist;
          expect(geo.elements).to.be.instanceOf(Array);
          R.forEach(e => expect(e).to.be.a("number"), geo.elements);
        });

        it("should have a vertices member that is an array of objects with coordinates",
           function () {
             const geo = geoFn();
             expect(geo).to.have.property("vertices");
             expect(geo.vertices).to.exist;
             expect(geo.vertices).to.be.instanceOf(Array);
             R.forEach((v) => {
               expect(v).to.have.property("position").that.is.an.instanceOf(Float32Array);
               expect(v).to.have.property("color").that.is.an.instanceOf(Float32Array);
               expect(v).to.not.have.property("normal");
             }, geo.vertices);
           });
      }

      function descriptionExpectations(geoFn) {
        it("should have a description member", function () {
          const geo = geoFn();
          expect(geo).to.have.property("description");
          expect(geo.description).to.include.keys("attribs", "stride");
          expect(geo.description.attribs).to.include.keys("position");
          expect(geo.description.attribs.position).to.include.keys("offset", "count");
          expect(geo.description.attribs.position.offset).to.equal(0);
          expect(geo.description.attribs.position.count).to.equal(3);
          expect(geo.description.stride).to.equal(28);
        });
      }

      describe("constructor initialization", function () {
        context("without poly data", function () {
          let fixture = null;

          manageLifetime({
            create: () => {
              expect(fixture).to.be.null;
              expect(gl).to.exist;
              fixture = new Geometry({ gl });
            },

            destroy: () => {
              if (fixture !== null) {
                expect(fixture).to.respondTo("destroy");
                fixture.destroy();
              }
            },

            cleanup: () => {
              fixture = null;
            },
          });

          it("should return a non-null Geometry object", function () {
            expect(fixture).to.exist;
          });

          it("should have an elements member that is an empty array", function () {
            expect(fixture).to.have.property("elements");
            expect(fixture.elements).to.exist;
            expect(fixture.elements).to.be.instanceOf(Array);
            expect(fixture.elements).to.be.empty;
          });

          it("should have a vertices member that is an empty array", function () {
            expect(fixture).to.have.property("vertices");
            expect(fixture.vertices).to.exist;
            expect(fixture.vertices).to.be.instanceOf(Array);
            expect(fixture.vertices).to.be.empty;
          });
        });

        context("with poly data", function () {
          let fixture = null;

          manageLifetime({
            create: () => {
              expect(fixture).to.be.null;
              expect(gl).to.exist;
              fixture = new Geometry({ gl, polyData: octohedronPolyData });
            },

            destroy: () => {
              if (fixture !== null) {
                expect(fixture).to.respondTo("destroy");
                fixture.destroy();
              }
            },

            cleanup: () => {
              fixture = null;
            },
          });

          it("should return a non-nil Geometry object", function () {
            expect(fixture).to.be.instanceOf(Geometry);
          });

          vertexDataExpectations(() => fixture);
          descriptionExpectations(() => fixture);
        });
      });

      describe("setVertices", function () {
        let fixture = null;

        manageLifetime({
          create: () => {
            expect(fixture).to.be.null;
            expect(gl).to.exist;
            fixture = new Geometry({ gl });
            fixture.setVertices(octohedronPolyData);
          },

          destroy: () => {
            if (fixture !== null) {
              expect(fixture).to.respondTo("destroy");
              fixture.destroy();
            }
          },

          cleanup: () => {
            fixture = null;
          },
        });

        vertexDataExpectations(() => fixture);
        descriptionExpectations(() => fixture);
      });

      describe("createBuffers", function () {
        let fixture = null;

        manageLifetime({
          create: () => {
            expect(fixture).to.be.null;
            expect(gl).to.exist;
            fixture = new Geometry({ gl, polyData: octohedronPolyData });
            fixture.createBuffers();
          },

          destroy: () => {
            if (fixture !== null) {
              expect(fixture).to.respondTo("destroy");
              fixture.destroy();
            }
          },

          cleanup: () => {
            fixture = null;
          },
        });

        it("should have a vertexBuffer member that is a WebGLBuffer", function () {
          expect(fixture).to.have.property("vertexBuffer").that.is.an.instanceOf(WebGLBuffer);
        });

        it("should have a vertexBuffer that is a flattened version of vertices.", function () {
          const buf = fixture.vertexBuffer;
          expect(gl.isBuffer(buf)).to.be.true;

          gl.bindBuffer(gl.ARRAY_BUFFER, buf);
          expect(gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE))
            .to.equal(fixture.description.stride * fixture.vertices.length);
          gl.bindBuffer(gl.ARRAY_BUFFER, null);
        });

        it("should have an elementBuffer member that is a WebGLBuffer", function () {
          expect(fixture).to.have.property("elementBuffer").that.is.an.instanceOf(WebGLBuffer);
        });

        it("should have an elementBuffer that is the elements", function () {
          const buf = fixture.elementBuffer;
          expect(gl.isBuffer(buf)).to.be.true;

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf);
          expect(gl.getBufferParameter(gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_SIZE))
            .to.equal(fixture.elements.length * Uint16Array.BYTES_PER_ELEMENT);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        });
      });

      describe("destroy", function () {
        let fixture = null;

        manageLifetime({
          create: () => {
            expect(fixture).to.be.null;
            expect(gl).to.exist;
            fixture = new Geometry({ gl, polyData: octohedronPolyData });
            fixture.createBuffers();
          },
          destroy: () => {
            if (fixture !== null) {
              expect(fixture).to.respondTo("destroy");
              fixture.destroy();
            }
          },
          cleanup: () => {
            fixture = null;
          },
        });

        it("should invalidate the vertex buffer", function () {
          const buf = fixture.vertexBuffer;
          expect(gl.isBuffer(buf)).to.be.true;
          fixture.destroy();
          expect(gl.isBuffer(buf)).to.be.false;
        });

        it("should invalidate the element buffer", function () {
          const buf = fixture.elementBuffer;
          expect(gl.isBuffer(buf)).to.be.true;
          fixture.destroy();
          expect(gl.isBuffer(buf)).to.be.false;
        });
      });

      describe("render", function () {
        let fixture = null;
        let program = null;

        manageLifetime({
          create: () => {
            expect(fixture).to.be.null;
            expect(gl).to.exist;
            fixture = new Geometry({ gl, polyData: octohedronPolyData });
            fixture.createBuffers();
          },
          destroy: () => {
            if (fixture !== null) {
              expect(fixture).to.respondTo("destroy");
              fixture.destroy();
            }
          },
          cleanup: () => {
            fixture = null;
          },
        });

        manageLifetime({
          create: () => {
            expect(program).to.be.null;
            expect(gl).to.exist;
            program = new Program(R.merge({ gl }, testShaderSource));
          },
          destroy: () => {
            if (program !== null) {
              expect(program).to.respondTo("destroy");
              program.destroy();
            }
          },
          cleanup: () => {
            program = null;
          },
        });

        describe("bindBuffers", function () {
          it("should bind the buffers", function () {
            fixture.bindBuffers();
            expect(gl.getParameter(gl.ARRAY_BUFFER_BINDING)).to.equal(fixture.vertexBuffer);
            expect(gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING))
              .to.equal(fixture.elementBuffer);
          });
        });

        describe("unbindBuffers", function () {
          it("should un-bind the buffers", function () {
            gl.bindBuffer(gl.ARRAY_BUFFER, fixture.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, fixture.elementBuffer);
            fixture.unbindBuffers();
            expect(gl.getParameter(gl.ARRAY_BUFFER_BINDING)).to.be.null;
            expect(gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING)).to.be.null;
          });
        });

        describe("setUpAttributes", function () {
          beforeEach(function () {
            expect(program).to.not.be.null;
            gl.useProgram(program.program);
          });

          afterEach(function () {
            gl.useProgram(null);
          });

          it("should set up the attributes", function () {
            fixture.setUpAttributes(program);
            const attrInfo = gl.getActiveAttrib(program.program, program.attributes.position);
            expect(attrInfo).to.exist;
            expect(attrInfo.size).to.equal(1);
            expect(attrInfo.type).to.equal(gl.FLOAT_VEC3);
            expect(attrInfo.name).to.equal("position");
          });
        });

        it("should not throw an error", function () {
          fixture.render(program);
        });

        it("should clean up after itself", function () {
          fixture.render(program);
          expect(gl.getParameter(gl.CURRENT_PROGRAM)).to.be.null;
          expect(gl.getParameter(gl.ARRAY_BUFFER_BINDING)).to.be.null;
          expect(gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING)).to.be.null;
        });
      });
    },
  });
});
