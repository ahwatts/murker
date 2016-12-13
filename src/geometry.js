/* eslint key-spacing: off */

import R from "ramda";

const PLY_ATTRIBUTES = [
  { name: "position", possibleKeys: ["x", "y", "z", "w"] },
  { name: "color", possibleKeys: ["red", "green", "blue", "alpha"] },
  { name: "normal", possibleKeys: ["nx", "ny", "nz"] },
];

const PLY_ATTRIBUTES_BY_NAME = R.indexBy(a => a.name, PLY_ATTRIBUTES);

function describeAttrib(vertex, possibleFields) {
  const attrib = { count: 0 };
  R.forEach((f) => {
    if (vertex[f] !== undefined) {
      attrib.count += 1;
    }
  }, possibleFields);
  return attrib;
}

function describeVertex(vertex) {
  const description = {
    attribs: {},
    stride: 0,
  };

  R.forEach((attrib) => {
    const attribDesc = describeAttrib(vertex, attrib.possibleKeys);
    if (attribDesc.count > 0) {
      attribDesc.floatOffset = R.reduce(
        (m, a) => m + a.count, 0,
        R.values(description.attribs));
      attribDesc.offset = attribDesc.floatOffset * Float32Array.BYTES_PER_ELEMENT;
      description.attribs[attrib.name] = attribDesc;
    }
  }, PLY_ATTRIBUTES);

  description.floatStride = R.reduce(
    (m, a) => m + a.count,
    0, R.values(description.attribs));
  description.stride = description.floatStride * Float32Array.BYTES_PER_ELEMENT;

  return description;
}

class Geometry {
  constructor({ gl, polyData }) {
    this.gl = gl;
    if (polyData !== undefined) {
      this.setVertices(polyData);
    } else {
      this.vertices = [];
      this.elements = [];
    }
  }

  setVertices(polyData) {
    // Figure out what the vertex attributes are, and prepare the
    // description of offsets and counts.
    const sampleVertex = R.head(polyData.vertex);
    const description = describeVertex(sampleVertex);

    // Turn each attribute in to a Float32Array, so that it can be used
    // with gl-matrix without any fuss.
    const vertices = R.map((pv) => {
      const v = {};
      R.forEach((attribName) => {
        const possibleKeys = PLY_ATTRIBUTES_BY_NAME[attribName].possibleKeys;
        const attribDesc = description.attribs[attribName];
        const attribVal = new Float32Array(attribDesc.count);
        for (let i = 0; i < possibleKeys.length; i += 1) {
          const key = possibleKeys[i];
          attribVal[i] = pv[key];
        }
        v[attribName] = attribVal;
      }, R.keys(description.attribs));
      return v;
    }, polyData.vertex);

    // Flatten the face array into the elements array.
    const elements = R.flatten(polyData.face);

    this.description = description;
    this.elements = elements;
    this.vertices = vertices;
  }

  createBuffers() {
    const gl = this.gl;
    const vertices = this.vertices;
    const elements = this.elements;
    const description = this.description;

    const elementData = new Uint16Array(elements.length);
    elementData.set(elements, 0);

    const vertexData = new Float32Array(description.floatStride * vertices.length);
    for (let i = 0; i < vertices.length; i += 1) {
      R.forEach((name) => {
        const desc = description.attribs[name];
        const base = (i * description.floatStride) + desc.floatOffset;
        vertexData.set(vertices[i][name], base);
      }, description.attribs);
    }

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const elementBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elementData, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    this.vertexBuffer = vertexBuffer;
    this.elementBuffer = elementBuffer;
  }

  bindBuffers() {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
  }

  unbindBuffers() {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  setUpAttributes(program) {
    const gl = this.gl;
    const description = this.description;
    R.forEach((desc, name) => {
      const location = program.attributes[name];
      if (location !== undefined && location !== null) {
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(
          location,
          desc.count,
          gl.FLOAT,
          false,
          description.stride,
          desc.offset);
      }
    }, description.attribs);
  }

  draw() {
    const gl = this.gl;
    gl.drawElements(gl.TRIANGLES, this.elements.length, gl.UNSIGNED_SHORT, 0);
    gl.flush();
  }

  render(program) {
    this.bindBuffers();
    this.setUpAttributes(program);
    this.draw();
    this.unbindBuffers();
  }

  destroy() {
    const gl = this.gl;
    if (gl.isBuffer(this.vertexBuffer)) {
      gl.deleteBuffer(this.vertexBuffer);
    }

    if (gl.isBuffer(this.elementBuffer)) {
      gl.deleteBuffer(this.elementBuffer);
    }

    this.vertexBuffer = null;
    this.elementBuffer = null;
  }

  static octohedron({ gl }) {
    const octohedronPolyData = {
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

    return new Geometry({ gl, polyData: octohedronPolyData });
  }
}

export default Geometry;
