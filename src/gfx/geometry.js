import R from 'ramda';

const PLY_ATTRIBUTES = [
  { name: 'position', possibleKeys: ['x', 'y', 'z', 'w'] },
  { name: 'color', possibleKeys: ['red', 'green', 'blue', 'alpha'] },
  { name: 'normal', possibleKeys: ['nx', 'ny', 'nz'] },
];

const PLY_ATTRIBUTES_BY_NAME = R.indexBy(a => a.name, PLY_ATTRIBUTES);

function describeAttrib(vertex, possibleFields) {
  const attrib = { count: 0 };
  R.forEach(possibleFields, (f) => {
    if (vertex[f] !== undefined) {
      attrib.count += 1;
    }
  });
  return attrib;
}

function describeVertex(vertex) {
  const description = {
    attribs: {},
    stride: 0,
  };

  R.forEach(PLY_ATTRIBUTES, (attrib) => {
    const attribDesc = describeAttrib(vertex, attrib.possibleKeys);
    if (attribDesc.count > 0) {
      attribDesc.float_offset = R.reduce((m, a) => m + a.count, 0, description.attribs);
      attribDesc.offset = attribDesc.float_offset * Float32Array.BYTES_PER_ELEMENT;
      description.attribs[attrib.name] = attribDesc;
    }
  });

  description.float_stride = R.reduce((m, a) => m + a.count, 0, description.attribs);
  description.stride = description.float_stride * Float32Array.BYTES_PER_ELEMENT;

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
      R.forEach((desc, name) => {
        const possibleKeys = PLY_ATTRIBUTES_BY_NAME[name].possibleKeys;
        const attribVal = new Float32Array(desc.count);
        R.each((k, i) => {
          attribVal[i] = pv[k];
        }, possibleKeys);
        v[name] = attribVal;
      }, description.attribs);
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

    const vertexData = new Float32Array(description.float_stride * vertices.length);
    R.forEach((v, i) => {
      R.forEach((desc, name) => {
        const base = (i * description.float_stride) + desc.float_offset;
        vertexData.set(v[name], base);
      }, description.attribs);
    }, vertices);

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
}

export default Geometry;
