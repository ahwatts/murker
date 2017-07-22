/* eslint key-spacing: off */

import R from "ramda";

const plyAttribToArray = keys => R.pipe(
  R.props(keys),
  R.filter(R.complement(R.isNil)),
);

function attribPair(name, keys, vertex) {
  return [name, Float32Array.from(plyAttribToArray(keys)(vertex))];
}

const plyAttributes = [
  R.partial(attribPair, ["position", ["x", "y", "z", "w"]]),
  R.partial(attribPair, ["color", ["red", "green", "blue", "alpha"]]),
  R.partial(attribPair, ["normal", ["nx", "ny", "nz"]]),
];

function plyVertexToArray(vertex) {
  return R.fromPairs(
    R.filter(
      p => R.last(p).length > 0,
      R.map(f => f(vertex), plyAttributes),
    ),
  );
}

function describeVertex(vertex) {
  const description = {
    attribs: {},
    stride: 0,
    floatStride: 0,
  };

  let byteOffset = 0;
  let quadOffset = 0;
  R.mapObjIndexed((value, name) => {
    const quadCount = value.length;
    description.attribs[name] = {
      offset: byteOffset,
      floatOffset: quadOffset,
      count: quadCount,
    };
    quadOffset += quadCount;
    byteOffset += quadCount * Float32Array.BYTES_PER_ELEMENT;
  }, vertex);

  description.stride = byteOffset;
  description.floatStride = quadOffset;

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
    this.vertices = R.map(plyVertexToArray, polyData.vertex);
    this.elements = R.flatten(polyData.face);
    this.description = describeVertex(R.head(this.vertices));
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
      R.mapObjIndexed((attribDesc, attribName) => {
        const base = (i * description.floatStride) + attribDesc.floatOffset;
        vertexData.set(vertices[i][attribName], base);
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
    R.mapObjIndexed((desc, name) => {
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

  static cube({ gl }) {
    const cubePolyData = {
      vertex: [
        { x:  1.0, y:  1.0, z:  1.0 }, // 0
        { x:  1.0, y:  1.0, z: -1.0 }, // 1
        { x:  1.0, y: -1.0, z:  1.0 }, // 2
        { x:  1.0, y: -1.0, z: -1.0 }, // 3
        { x: -1.0, y:  1.0, z:  1.0 }, // 4
        { x: -1.0, y:  1.0, z: -1.0 }, // 5
        { x: -1.0, y: -1.0, z:  1.0 }, // 6
        { x: -1.0, y: -1.0, z: -1.0 }, // 7
      ],
      face: [
        [0, 2, 1],
        [1, 2, 3],
        [0, 4, 6],
        [2, 0, 6],
        [4, 5, 7],
        [6, 4, 7],
        [5, 1, 3],
        [7, 5, 3],
        [0, 1, 5],
        [4, 0, 5],
        [2, 6, 7],
        [3, 2, 7],
      ],
    };

    return new Geometry({ gl, polyData: cubePolyData });
  }
}

export default Geometry;
