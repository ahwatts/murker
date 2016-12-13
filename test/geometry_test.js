/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback,
   no-unused-expressions, import/no-extraneous-dependencies */

import { expect } from "chai";
import R from "ramda";
import Geometry from "../src/geometry";
import WebGLContext from "./webgl_fixture";
import { manageLifetime, octohedronPolyData } from "./test_utils";

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
             expect(v).to.have.property("position").that.is.instanceOf(Float32Array);
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

    describe("constructor", function () {
      context("without poly data", function () {
        let fixture = null;

        manageLifetime({
          create: () => {
            expect(fixture).to.be.null;
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
  });
});
