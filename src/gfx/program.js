"use strict";

var gl = null;

var createShader = function(type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    var log = gl.getShaderInfoLog(shader);
    console.error("Shader failed to compile: " + log + "\n" + "Shader source:\n" + source);
    gl.deleteShader(shader);
    shader = null;
  }
  return shader;
};

var createProgram = function(vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    var log = gl.getProgramInfoLog(program);
    console.error("Shader program failed to link: " + log);
    gl.deleteProgram(program);
    program = null;
  }
  return program;
};

var Program = function(sources) {
  if (gl === null) {
    gl = window.gl;
  }

  this.program = createProgram(
    createShader(gl.VERTEX_SHADER, sources.vertexSource),
    createShader(gl.FRAGMENT_SHADER, sources.fragmentSource)
  );

  this.attributes = {};
  this.uniforms = {};

  var n_attrs, n_unis, i, info;
  n_attrs = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
  n_unis = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);

  for (i = 0; i < n_attrs; ++i) {
    info = gl.getActiveAttrib(this.program, i);
    this.attributes[info.name] = gl.getAttribLocation(this.program, info.name);
  }

  for (i = 0; i < n_unis; ++i) {
    info = gl.getActiveUniform(this.program, i);
    this.uniforms[info.name] = gl.getUniformLocation(this.program, info.name);
  }
};

Program.prototype.destroy = function() {
  var program = this.program;
  this.program = null;

  gl.useProgram(null);
  if (gl.isProgram(program)) {
    gl.getAttachedShaders(program).forEach(function(shader) {
      if (gl.isShader(shader)) {
        gl.detachShader(program, shader);
        gl.deleteShader(shader);
      }
    });
    gl.deleteProgram(program);
  }
};

module.exports = Program;
