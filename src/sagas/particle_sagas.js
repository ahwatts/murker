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

export function particles(gl) {
  // eslint-disable-next-line no-unused-vars
  const texFloat = gl.getExtension("OES_texture_float");
  const drawBuf = gl.getExtension("WEBGL_draw_buffers");

  const particleUVs = new Float32Array(NUM_PARTICLES * 2);
  const du = 1.0 / PARTICLES_WIDTH;
  const dv = 1.0 / PARTICLES_HEIGHT;

  const particlePositions = new Float32Array(NUM_PARTICLES * 3);
  const particleVelocities = new Float32Array(NUM_PARTICLES * 3);
  const particleColors = new Float32Array(NUM_PARTICLES * 4);

  for (let i = 0; i < PARTICLES_WIDTH; i += 1) {
    for (let j = 0; j < PARTICLES_HEIGHT; j += 1) {
      const xIndex = (i * PARTICLES_WIDTH) + j;
      const yIndex = xIndex + 1;
      const zIndex = xIndex + 2;
      const aIndex = xIndex + 3;

      particleUVs[xIndex] = du * i;
      particleUVs[yIndex] = dv * i;

      particlePositions[xIndex] = du * i;
      particlePositions[yIndex] = dv * i;
      particlePositions[zIndex] = 0.0;

      particleVelocities[xIndex] = 0.0;
      particleVelocities[yIndex] = 0.0;
      particleVelocities[zIndex] = 0.0;

      particleColors[xIndex] = 1.0;
      particleColors[yIndex] = 1.0;
      particleColors[zIndex] = 1.0;
      particleColors[aIndex] = 1.0;
    }
  }

  const particleUVsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, particleUVsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, particleUVs, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  const particlePositionsTexture = createComputeTexture(gl);
  setTextureData(
    gl, particlePositionsTexture, gl.RGB, gl.FLOAT,
    PARTICLES_WIDTH, PARTICLES_HEIGHT,
    particlePositions);

  const particleVelocitiesTexture = createComputeTexture(gl);
  setTextureData(
    gl, particleVelocitiesTexture, gl.RGB, gl.FLOAT,
    PARTICLES_WIDTH, PARTICLES_HEIGHT,
    particleVelocities);

  const particleColorsTexture = createComputeTexture(gl);
  setTextureData(
    gl, particleColorsTexture, gl.RGBA, gl.FLOAT,
    PARTICLES_WIDTH, PARTICLES_HEIGHT,
    particleColors);

  return {
    update() {},
    render() {},
  };
}

export default {};
