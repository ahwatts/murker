/* eslint no-bitwise: off */

import { mat4, vec3 } from "gl-matrix";

import Program from "../program";
import Utils from "../utils";
import particleDrawVertexSrc from "../shaders/particle_draw.vert";
import particleDrawFragmentSrc from "../shaders/particle_draw.frag";
import particleSimVertexSrc from "../shaders/particle_sim.vert";
import particleSimFragmentSrc from "../shaders/particle_sim.frag";
import texDebugVertexSrc from "../shaders/tex_debug.vert";
import texDebugFragmentSrc from "../shaders/tex_debug.frag";

const PARTICLES_WIDTH = 1024;
const PARTICLES_HEIGHT = PARTICLES_WIDTH;
const NUM_PARTICLES = PARTICLES_WIDTH * PARTICLES_HEIGHT;
const GLOBALS = {
  context: {
    gl: null,
    drawBuf: null,
    texFloat: null,
  },
  programs: {
    sim: null,
    draw: null,
    texDebug: null,
  },
  geometries: {
    texSquare: {
      vertices: null,
      buffer: null,
    },
  },
};

function initGlobals(gl) {
  GLOBALS.context.gl = gl;
  GLOBALS.context.drawBuf = gl.getExtension("WEBGL_draw_buffers");
  GLOBALS.context.texFloat = gl.getExtension("OES_texture_float");

  GLOBALS.programs.sim = new Program({
    gl,
    vertexSource: particleSimVertexSrc,
    fragmentSource: particleSimFragmentSrc,
  });

  GLOBALS.programs.draw = new Program({
    gl,
    vertexSource: particleDrawVertexSrc,
    fragmentSource: particleDrawFragmentSrc,
  });

  GLOBALS.programs.texDebug = new Program({
    gl,
    vertexSource: texDebugVertexSrc,
    fragmentSource: texDebugFragmentSrc,
  });

  /* eslint-disable no-multi-spaces, indent */
  GLOBALS.geometries.texSquare.vertices = Float32Array.from([
    -1.0, -1.0, 0.0,  0.0, 0.0,
     1.0,  1.0, 0.0,  1.0, 1.0,
    -1.0,  1.0, 0.0,  0.0, 1.0,

     1.0,  1.0, 0.0,  1.0, 1.0,
    -1.0, -1.0, 0.0,  0.0, 0.0,
     1.0, -1.0, 0.0,  1.0, 0.0,
  ]);
  /* eslint-enable no-multi-spaces, indent */

  GLOBALS.geometries.texSquare.buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, GLOBALS.geometries.texSquare.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, GLOBALS.geometries.texSquare.vertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function createComputeTexture() {
  const gl = GLOBALS.context.gl;
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
}

function setTextureData(texture, format, type, width, height, data) {
  const gl = GLOBALS.context.gl;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  /* eslint-disable no-multi-spaces */
  gl.texImage2D(
    gl.TEXTURE_2D, // target
    0,             // level
    format,        // internal format
    width,         // width
    height,        // height
    0,             // border
    format,        // format
    type,          // type
    data,          // data
  );
  /* eslint-enable no-multi-spaces */
  gl.bindTexture(gl.TEXTURE_2D, null);
}

class ComputeFramebuffer {
  constructor(positions, velocities, colors) {
    const gl = GLOBALS.context.gl;
    const drawBuf = GLOBALS.context.drawBuf;

    this.positionsTexture = createComputeTexture(gl);
    setTextureData(
      this.positionsTexture, gl.RGB, gl.FLOAT,
      PARTICLES_WIDTH, PARTICLES_HEIGHT,
      positions);

    this.velocitiesTexture = createComputeTexture(gl);
    setTextureData(
      this.velocitiesTexture, gl.RGB, gl.FLOAT,
      PARTICLES_WIDTH, PARTICLES_HEIGHT,
      velocities);

    this.colorsTexture = createComputeTexture(gl);
    setTextureData(
      this.colorsTexture, gl.RGBA, gl.FLOAT,
      PARTICLES_WIDTH, PARTICLES_HEIGHT,
      colors);

    this.framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, drawBuf.COLOR_ATTACHMENT0_WEBGL,
      gl.TEXTURE_2D, this.positionsTexture, 0);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, drawBuf.COLOR_ATTACHMENT1_WEBGL,
      gl.TEXTURE_2D, this.velocitiesTexture, 0);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, drawBuf.COLOR_ATTACHMENT2_WEBGL,
      gl.TEXTURE_2D, this.colorsTexture, 0);

    drawBuf.drawBuffersWEBGL([
      drawBuf.COLOR_ATTACHMENT0_WEBGL,
      drawBuf.COLOR_ATTACHMENT1_WEBGL,
      drawBuf.COLOR_ATTACHMENT2_WEBGL,
    ]);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}

class ParticleSystem {
  constructor(width, height, texCoords, positions, velocities, colors) {
    const gl = GLOBALS.context.gl;
    this.width = width;
    this.height = height;

    this.texCoords = {
      vertices: texCoords,
      buffer: gl.createBuffer(),
    };

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoords.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.texCoords.vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.drawProgram = GLOBALS.programs.draw;

    this.texSquare = GLOBALS.geometries.texSquare;
    this.srcComputeFramebuffer = new ComputeFramebuffer(positions, velocities, colors);
    this.dstComputeFramebuffer = new ComputeFramebuffer(positions, velocities, colors);
  }

  simulate(simProgram, setup, teardown) {
    const gl = GLOBALS.context.gl;

    // Swap the framebuffers.
    const tmp = this.srcComputeFramebuffer;
    this.srcComputeFramebuffer = this.dstComputeFramebuffer;
    this.dstComputeFramebuffer = tmp;

    gl.useProgram(simProgram.program);

    // Attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texSquare.buffer);
    gl.enableVertexAttribArray(simProgram.attributes.position);
    gl.vertexAttribPointer(simProgram.attributes.position, 3, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(simProgram.attributes.tex_coord);
    gl.vertexAttribPointer(simProgram.attributes.tex_coord, 2, gl.FLOAT, false, 20, 12);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Uniforms
    setup();

    // Textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.srcComputeFramebuffer.positionsTexture);
    gl.uniform1i(simProgram.uniforms.positions, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.srcComputeFramebuffer.velocitiesTexture);
    gl.uniform1i(simProgram.uniforms.velocities, 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.srcComputeFramebuffer.colorsTexture);
    gl.uniform1i(simProgram.colors, 2);

    // Output
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.dstComputeFramebuffer.framebuffer);
    gl.viewport(0, 0, this.width, this.height);

    // "Draw"
    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, this.texSquare.vertices.length / 5);

    // Cleanup.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    teardown();
    gl.useProgram(null);
  }

  draw(matrices) {
    const gl = GLOBALS.context.gl;

    gl.useProgram(this.drawProgram.program);

    // Attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoords.buffer);
    gl.enableVertexAttribArray(this.drawProgram.attributes.tex_coord);
    gl.vertexAttribPointer(this.drawProgram.attributes.tex_coord, 2, gl.FLOAT, false, 8, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Uniforms
    gl.uniformMatrix4fv(this.drawProgram.uniforms.model, false, matrices.model);
    gl.uniformMatrix4fv(this.drawProgram.uniforms.view, false, matrices.view);
    gl.uniformMatrix4fv(this.drawProgram.uniforms.projection, false, matrices.projection);

    // Textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.dstComputeFramebuffer.positionsTexture);
    gl.uniform1i(this.drawProgram.uniforms.positions, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.dstComputeFramebuffer.colorsTexture);
    gl.uniform1i(this.drawProgram.uniforms.colors, 1);

    // Draw
    gl.drawArrays(gl.POINTS, 0, this.texCoords.vertices.length / 2);

    // Cleanup.
    gl.useProgram(null);
  }
}

export function particles(gl) {
  initGlobals(gl);

  const particleUVs = new Float32Array(NUM_PARTICLES * 2);
  const du = 1.0 / PARTICLES_WIDTH;
  const dv = 1.0 / PARTICLES_HEIGHT;

  const positions = new Float32Array(NUM_PARTICLES * 3);
  const velocities = new Float32Array(NUM_PARTICLES * 3);
  const colors = new Float32Array(NUM_PARTICLES * 4);

  for (let i = 0; i < PARTICLES_WIDTH; i += 1) {
    for (let j = 0; j < PARTICLES_HEIGHT; j += 1) {
      const elemIndex = (i * PARTICLES_WIDTH) + j;

      particleUVs[(elemIndex * 2) + 0] = du * i;
      particleUVs[(elemIndex * 2) + 1] = dv * j;

      positions[(elemIndex * 3) + 0] = du * i;
      positions[(elemIndex * 3) + 1] = dv * j;
      positions[(elemIndex * 3) + 2] = 0.0;

      velocities[(elemIndex * 3) + 0] = -1.0;
      velocities[(elemIndex * 3) + 1] = 0.0;
      velocities[(elemIndex * 3) + 2] = 0.0;

      colors[(elemIndex * 4) + 0] = 1.0;
      colors[(elemIndex * 4) + 1] = 1.0;
      colors[(elemIndex * 4) + 2] = 1.0;
      colors[(elemIndex * 4) + 3] = 1.0;
    }
  }

  const system = new ParticleSystem(
    PARTICLES_WIDTH, PARTICLES_HEIGHT, particleUVs,
    positions, velocities, colors);

  return {
    update() {
      const simProgram = GLOBALS.programs.sim;

      system.simulate(
        simProgram,
        () => {
          gl.uniform1f(simProgram.uniforms.dt, 0.001);
        },
        () => {},
      );
    },

    render() {
      const { width, height } = Utils.getDimensions();
      const projection = mat4.create();
      const view = mat4.create();
      const model = mat4.create();

      mat4.perspective(projection, Math.PI / 6.0, width / height, 0.1, 100.0);
      mat4.lookAt(
        view,
        vec3.fromValues(0.0, 0.0, 10.0),
        vec3.fromValues(0.0, 0.0, 0.0),
        vec3.fromValues(0.0, 1.0, 0.0),
      );
      mat4.identity(model);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, width, height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      system.draw({ model, view, projection });

      // const model2 = mat4.create();
      // mat4.translate(model2, model, vec3.fromValues(-2.0, 0.0, 0.0));

      // gl.useProgram(texDebugProgram.program);

      // gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
      // gl.enableVertexAttribArray(texDebugProgram.attributes.position);
      // gl.vertexAttribPointer(texDebugProgram.attributes.position, 3, gl.FLOAT, false, 20, 0);
      // gl.enableVertexAttribArray(texDebugProgram.attributes.tex_coord);
      // gl.vertexAttribPointer(texDebugProgram.attributes.tex_coord, 2, gl.FLOAT, false, 20, 12);
      // gl.bindBuffer(gl.ARRAY_BUFFER, null);

      // gl.uniformMatrix4fv(texDebugProgram.uniforms.model, false, model2);
      // gl.uniformMatrix4fv(texDebugProgram.uniforms.view, false, view);
      // gl.uniformMatrix4fv(texDebugProgram.uniforms.projection, false, projection);

      // gl.activeTexture(gl.TEXTURE0);
      // gl.bindTexture(gl.TEXTURE_2D, dstComputeFramebuffer.velocitiesTexture);
      // gl.uniform1i(texDebugProgram.uniforms.colors, 0);

      // gl.drawArrays(gl.TRIANGLES, 0, squareVertices.length / 5);
      // gl.useProgram(null);
    },
  };
}

export default {};