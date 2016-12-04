import R from 'ramda';

function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // const log = gl.getShaderInfoLog(shader);
    // console.error("Shader failed to compile: " + log + "\n" + "Shader source:\n" + source);
    gl.deleteShader(shader);
    shader = null;
  }
  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    // const log = gl.getProgramInfoLog(program);
    // console.error("Shader program failed to link: " + log);
    gl.deleteProgram(program);
    program = null;
  }
  return program;
}

class Program {
  constructor({ gl, vertexSource, fragmentSource }) {
    this.gl = gl;

    this.program = createProgram(
      createShader(gl.VERTEX_SHADER, vertexSource),
      createShader(gl.FRAGMENT_SHADER, fragmentSource),
    );

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
    const gl = this.gl;
    const program = this.program;
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
