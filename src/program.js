/* eslint no-console: off */

import * as R from "ramda";

function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    console.error(`Shader failed to compile: ${log}\nShader source:\n${source}`);
    gl.deleteShader(shader);
    shader = null;
  }
  return shader;
}

function createProgram(gl, shaders, preLinkStep) {
  let program = gl.createProgram();

  R.forEach(shader => gl.attachShader(program, shader), shaders);

  if (!R.isNil(preLinkStep)) {
    preLinkStep(program);
  }

  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    console.error(`Shader program failed to link: ${log}`);
    gl.deleteProgram(program);
    program = null;
  }
  return program;
}

class Program {
  constructor({ gl, sources, preLinkStep }) {
    this.gl = gl;

    const shaders = R.map(
      ([type, src]) => createShader(gl, type, src),
      sources,
    );

    this.program = createProgram(gl, shaders, preLinkStep);
    this.attributes = {};
    this.uniforms = {};

    const numAttrs = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
    const numUnis = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < numAttrs; i += 1) {
      const info = gl.getActiveAttrib(this.program, i);
      this.attributes[info.name] = gl.getAttribLocation(this.program, info.name);
    }

    for (let i = 0; i < numUnis; i += 1) {
      const info = gl.getActiveUniform(this.program, i);
      this.uniforms[info.name] = gl.getUniformLocation(this.program, info.name);
    }
  }

  destroy() {
    const { gl, program } = this;
    this.program = null;

    gl.useProgram(null);
    if (gl.isProgram(program)) {
      R.forEach((shader) => {
        if (gl.isShader(shader)) {
          gl.detachShader(program, shader);
          gl.deleteShader(shader);
        }
      }, gl.getAttachedShaders(program));
      gl.deleteProgram(program);
    }
  }
}

export default Program;
