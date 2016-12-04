"use strict";

var gl = null;
var _ = require("underscore");

var PLY_ATTRIBUTES = [
  { name: "position", possibleKeys: [ "x", "y", "z", "w"] },
  { name: "color",    possibleKeys: [ "red", "green", "blue", "alpha" ] },
  { name: "normal",   possibleKeys: [ "nx", "ny", "nz" ] }
];

var PLY_ATTRIBUTES_BY_NAME = _.indexBy(PLY_ATTRIBUTES, "name");

function describeAttrib(vertex, possibleFields) {
  var attrib = { count: 0 };
  _.each(possibleFields, function(f) {
    if (vertex[f] !== undefined) {
      attrib.count += 1;
    }
  });
  return attrib;
}

function describeVertex(vertex) {
  var description = {
    attribs: {},
    stride: 0
  };

  _.each(PLY_ATTRIBUTES, function(attrib) {
    var attribDesc = describeAttrib(vertex, attrib.possibleKeys);
    if (attribDesc.count > 0) {
      attribDesc.float_offset = _.reduce(description.attribs, function(m, a) {
        return m + a.count;
      }, 0);
      attribDesc.offset = attribDesc.float_offset * Float32Array.BYTES_PER_ELEMENT;
      description.attribs[attrib.name] = attribDesc;
    }
  });

  description.float_stride = _.reduce(description.attribs, function(m, a) {
    return m + a.count;
  }, 0);
  description.stride = description.float_stride * Float32Array.BYTES_PER_ELEMENT;

  return description;
}

var Geometry = function(polyData) {
  if (gl === null) {
    gl = window.gl;
  }

  if (polyData !== undefined) {
    this.setVertices(polyData);
  } else {
    this.vertices = [];
    this.elements = [];
  }
};

Geometry.prototype.setVertices = function(polyData) {
  // Figure out what the vertex attributes are, and prepare the
  // description of offsets and counts.
  var sampleVertex = _.sample(polyData.vertex);
  var description = describeVertex(sampleVertex);

  // Turn each attribute in to a Float32Array, so that it can be used
  // with gl-matrix without any fuss.
  var vertices = _.map(polyData.vertex, function(pv) {
    var v = {};
    _.each(description.attribs, function(desc, name) {
      var possibleKeys = PLY_ATTRIBUTES_BY_NAME[name].possibleKeys;
      var attribVal = new Float32Array(desc.count);
      _.each(possibleKeys, function(k, i) {
        attribVal[i] = pv[k];
      });
      v[name] = attribVal;
    });
    return v;
  });

  // Flatten the face array into the elements array.
  var elements = _.flatten(polyData.face);

  this.description = description;
  this.elements = elements;
  this.vertices = vertices;
};

Geometry.prototype.createBuffers = function() {
  var vertices = this.vertices;
  var elements = this.elements;
  var description = this.description;

  var elementData = new Uint16Array(elements.length);
  elementData.set(elements, 0);

  var vertexData = new Float32Array(description.float_stride * vertices.length);
  _.each(vertices, function(v, i) {
    _.each(description.attribs, function(desc, name) {
      var base = (i * description.float_stride) + desc.float_offset;
      vertexData.set(v[name], base);
    });
  });

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  var elementBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elementData, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  this.vertexBuffer = vertexBuffer;
  this.elementBuffer = elementBuffer;
};

Geometry.prototype.bindBuffers = function() {
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
};

Geometry.prototype.unbindBuffers = function() {
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

Geometry.prototype.setUpAttributes = function(program) {
  var description = this.description;
  _.each(description.attribs, function(desc, name) {
    var location = program.attributes[name];
    if (location !== undefined && location !== null) {
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, desc.count, gl.FLOAT, false, description.stride, desc.offset);
    }
  });
};

Geometry.prototype.draw = function() {
  gl.drawElements(gl.TRIANGLES, this.elements.length, gl.UNSIGNED_SHORT, 0);
  gl.flush();
};

Geometry.prototype.render = function(program) {
  this.bindBuffers();
  this.setUpAttributes(program);
  this.draw();
  this.unbindBuffers();
};

Geometry.prototype.destroy = function() {
  if (gl.isBuffer(this.vertexBuffer)) {
    gl.deleteBuffer(this.vertexBuffer);
  }

  if (gl.isBuffer(this.elementBuffer)) {
    gl.deleteBuffer(this.elementBuffer);
  }

  this.vertexBuffer = null;
  this.elementBuffer = null;
};

module.exports = Geometry;
