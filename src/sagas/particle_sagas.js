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

const PARTICLES_WIDTH = 32;
const PARTICLES_HEIGHT = PARTICLES_WIDTH;
const NUM_PARTICLES = PARTICLES_WIDTH * PARTICLES_HEIGHT;

function createComputeTexture(gl) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
}

function setTextureData(gl, texture, format, type, width, height, data) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
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
  gl.bindTexture(gl.TEXTURE_2D, null);
}

class ComputeFramebuffer {
  constructor(gl, positions, momenta, colors) {
    this.gl = gl;

    // eslint-disable-next-line no-unused-vars
    const texFloat = gl.getExtension("OES_texture_float");
    const drawBuf = gl.getExtension("WEBGL_draw_buffers");
    this.drawBuf = drawBuf;

    this.positionsTexture = createComputeTexture(gl);
    setTextureData(
      gl, this.positionsTexture, gl.RGB, gl.FLOAT,
      PARTICLES_WIDTH, PARTICLES_HEIGHT,
      positions);

    this.momentaTexture = createComputeTexture(gl);
    setTextureData(
      gl, this.momentaTexture, gl.RGB, gl.FLOAT,
      PARTICLES_WIDTH, PARTICLES_HEIGHT,
      momenta);

    this.colorsTexture = createComputeTexture(gl);
    setTextureData(
      gl, this.colorsTexture, gl.RGBA, gl.FLOAT,
      PARTICLES_WIDTH, PARTICLES_HEIGHT,
      colors);

    this.framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, drawBuf.COLOR_ATTACHMENT0_WEBGL,
      gl.TEXTURE_2D, this.positionsTexture, 0);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, drawBuf.COLOR_ATTACHMENT1_WEBGL,
      gl.TEXTURE_2D, this.momentaTexture, 0);
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

export function particles(gl) {
  /* eslint-disable no-unused-vars */
  const texFloat = gl.getExtension("OES_texture_float");
  const drawBuf = gl.getExtension("WEBGL_draw_buffers");
  /* eslint-enable no-unused-vars */

  const simProgram = new Program({
    gl,
    vertexSource: particleSimVertexSrc,
    fragmentSource: particleSimFragmentSrc,
  });

  const drawProgram = new Program({
    gl,
    vertexSource: particleDrawVertexSrc,
    fragmentSource: particleDrawFragmentSrc,
  });

  const texDebugProgram = new Program({
    gl,
    vertexSource: texDebugVertexSrc,
    fragmentSource: texDebugFragmentSrc,
  });

  const particleUVs = new Float32Array(NUM_PARTICLES * 2);
  const du = 1.0 / PARTICLES_WIDTH;
  const dv = 1.0 / PARTICLES_HEIGHT;

  const positions = new Float32Array(NUM_PARTICLES * 3);
  const momenta = new Float32Array(NUM_PARTICLES * 3);
  const colors = new Float32Array(NUM_PARTICLES * 4);

  for (let i = 0; i < PARTICLES_WIDTH; i += 1) {
    for (let j = 0; j < PARTICLES_HEIGHT; j += 1) {
      const elemIndex = (i * PARTICLES_WIDTH) + j;

      particleUVs[(elemIndex * 2) + 0] = du * i;
      particleUVs[(elemIndex * 2) + 1] = dv * j;

      positions[(elemIndex * 3) + 0] = du * i;
      positions[(elemIndex * 3) + 1] = dv * j;
      positions[(elemIndex * 3) + 2] = 0.0;

      momenta[(elemIndex * 3) + 0] = 0.0;
      momenta[(elemIndex * 3) + 1] = 0.0;
      momenta[(elemIndex * 3) + 2] = 0.0;

      colors[(elemIndex * 4) + 0] = 1.0;
      colors[(elemIndex * 4) + 1] = 1.0;
      colors[(elemIndex * 4) + 2] = 1.0;
      colors[(elemIndex * 4) + 3] = 1.0;
    }
  }

  const uvsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, particleUVs, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  let srcComputeFramebuffer = new ComputeFramebuffer(gl, positions, momenta, colors);
  let dstComputeFramebuffer = new ComputeFramebuffer(gl, positions, momenta, colors);

  /* eslint-disable no-multi-spaces, indent */
  const squareVertices = Float32Array.from([
    -1.0, -1.0, 0.0,  0.0, 0.0,
     1.0,  1.0, 0.0,  1.0, 1.0,
    -1.0,  1.0, 0.0,  0.0, 1.0,

     1.0,  1.0, 0.0,  1.0, 1.0,
    -1.0, -1.0, 0.0,  0.0, 0.0,
     1.0, -1.0, 0.0,  1.0, 0.0,
  ]);
  /* eslint-enable no-multi-spaces, indent */

  const squareBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return {
    update() {
      // Swap the framebuffers.
      const tmp = srcComputeFramebuffer;
      srcComputeFramebuffer = dstComputeFramebuffer;
      dstComputeFramebuffer = tmp;

      gl.useProgram(simProgram.program);

      // Attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, uvsBuffer);
      gl.enableVertexAttribArray(simProgram.attributes.tex_coord);
      gl.vertexAttribPointer(simProgram.attributes.tex_coord, 2, gl.FLOAT, false, 8, 0);

      // Uniforms
      gl.uniform1f(simProgram.uniforms.dt, 0.001);
      gl.uniform2fv(simProgram.uniforms.resolution, [PARTICLES_WIDTH, PARTICLES_HEIGHT]);

      // Textures
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, srcComputeFramebuffer.positionsTexture);
      gl.uniform1i(simProgram.uniforms.positions, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, srcComputeFramebuffer.momentaTexture);
      gl.uniform1i(simProgram.uniforms.momenta, 1);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, srcComputeFramebuffer.colorsTexture);
      gl.uniform1i(simProgram.colors, 2);

      // Output
      gl.bindFramebuffer(gl.FRAMEBUFFER, dstComputeFramebuffer.framebuffer);
      gl.viewport(0, 0, PARTICLES_WIDTH, PARTICLES_HEIGHT);

      // "Draw"
      // gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, particleUVs.length / 2);

      // Cleanup.
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.useProgram(null);
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

      gl.viewport(0, 0, width, height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.useProgram(drawProgram.program);

      // Attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, uvsBuffer);
      gl.enableVertexAttribArray(simProgram.attributes.tex_coord);
      gl.vertexAttribPointer(simProgram.attributes.tex_coord, 2, gl.FLOAT, false, 8, 0);

      // Uniforms
      gl.uniformMatrix4fv(drawProgram.uniforms.model, false, model);
      gl.uniformMatrix4fv(drawProgram.uniforms.view, false, view);
      gl.uniformMatrix4fv(drawProgram.uniforms.projection, false, projection);

      // Textures
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, dstComputeFramebuffer.positionsTexture);
      gl.uniform1i(drawProgram.uniforms.positions, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, dstComputeFramebuffer.colorsTexture);
      gl.uniform1i(drawProgram.uniforms.colors, 1);

      // Draw
      gl.drawArrays(gl.POINTS, 0, particleUVs.length / 2);

      // Cleanup.
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.useProgram(null);

      const model2 = mat4.create();
      mat4.translate(model2, model, vec3.fromValues(-2.0, 0.0, 0.0));

      gl.useProgram(texDebugProgram.program);

      gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
      gl.enableVertexAttribArray(texDebugProgram.attributes.position);
      gl.vertexAttribPointer(texDebugProgram.attributes.position, 3, gl.FLOAT, false, 20, 0);
      gl.enableVertexAttribArray(texDebugProgram.attributes.tex_coord);
      gl.vertexAttribPointer(texDebugProgram.attributes.tex_coord, 2, gl.FLOAT, false, 20, 12);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);

      gl.uniformMatrix4fv(texDebugProgram.uniforms.model, false, model2);
      gl.uniformMatrix4fv(texDebugProgram.uniforms.view, false, view);
      gl.uniformMatrix4fv(texDebugProgram.uniforms.projection, false, projection);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, dstComputeFramebuffer.positionsTexture);
      gl.uniform1i(texDebugProgram.uniforms.colors, 0);

      gl.drawArrays(gl.TRIANGLES, 0, squareVertices.length / 5);

      gl.useProgram(null);
    },
  };
}

export default {};
