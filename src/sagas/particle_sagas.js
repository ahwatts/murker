import Program from "../program";
import particleSimVertexSrc from "../shaders/particle_sim.vert";
import particleSimFragmentSrc from "../shaders/particle_sim.frag";

const PARTICLES_WIDTH = 16;
const PARTICLES_HEIGHT = 16;
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
  }
}

export function particles(gl) {
  // eslint-disable-next-line no-unused-vars
  const texFloat = gl.getExtension("OES_texture_float");
  const drawBuf = gl.getExtension("WEBGL_draw_buffers");

  const simProgram = new Program({
    gl,
    vertexSource: particleSimVertexSrc,
    fragmentSource: particleSimFragmentSrc,
  });

  const particleUVs = new Float32Array(NUM_PARTICLES * 2);
  const du = 1.0 / PARTICLES_WIDTH;
  const dv = 1.0 / PARTICLES_HEIGHT;

  const positions = new Float32Array(NUM_PARTICLES * 3);
  const momenta = new Float32Array(NUM_PARTICLES * 3);
  const colors = new Float32Array(NUM_PARTICLES * 4);

  for (let i = 0; i < PARTICLES_WIDTH; i += 1) {
    for (let j = 0; j < PARTICLES_HEIGHT; j += 1) {
      const xIndex = (i * PARTICLES_WIDTH) + j;
      const yIndex = xIndex + 1;
      const zIndex = xIndex + 2;
      const aIndex = xIndex + 3;

      particleUVs[xIndex] = du * i;
      particleUVs[yIndex] = dv * i;

      positions[xIndex] = du * i;
      positions[yIndex] = dv * i;
      positions[zIndex] = 0.0;

      momenta[xIndex] = 0.0;
      momenta[yIndex] = 0.0;
      momenta[zIndex] = 0.0;

      colors[xIndex] = 1.0;
      colors[yIndex] = 1.0;
      colors[zIndex] = 1.0;
      colors[aIndex] = 1.0;
    }
  }

  const uvsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, particleUVs, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  let srcComputeFramebuffer = new ComputeFramebuffer(gl, positions, momenta, colors);
  let dstComputeFramebuffer = new ComputeFramebuffer(gl, positions, momenta, colors);

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

      // Output.
      gl.bindFramebuffer(gl.FRAMEBUFFER, dstComputeFramebuffer.framebuffer);
      drawBuf.drawBuffersWEBGL([
        drawBuf.COLOR_ATTACHMENT0_WEBGL,
        drawBuf.COLOR_ATTACHMENT1_WEBGL,
        drawBuf.COLOR_ATTACHMENT2_WEBGL,
      ]);

      // Draw.
      gl.viewport(0, 0, PARTICLES_WIDTH, PARTICLES_HEIGHT);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, particleUVs.length / 2);

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.useProgram(null);
    },

    render() {},
  };
}

export default {};
