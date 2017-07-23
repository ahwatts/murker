import Geometry from "../geometry";
import Mesh from "../mesh";
import Program from "../program";
import Scene from "../scene";
import spiralFragmentSrc from "../shaders/spiral.frag";
import spiralVertexSrc from "../shaders/spiral.vert";
import { getDimensions } from "../utils";
import { FREQ_BIN_COUNT } from "./song_sagas";

export function spiral(gl) {
  const geometry = Geometry.cube({ gl });
  geometry.createBuffers();

  const program = new Program({
    gl,
    vertexSource: spiralVertexSrc,
    fragmentSource: spiralFragmentSrc,
  });

  const mesh = new Mesh({ gl, geometry, program });

  const { canvasWidth, canvasHeight } = getDimensions();
  const scene = new Scene({ gl, canvasWidth, canvasHeight });

  const texWidth = FREQ_BIN_COUNT;
  const texHeight = 3;

  const timeData = new Uint8Array(texWidth * texHeight);
  for (let i = 0; i < timeData.length; i += 1) { timeData[i] = 128; }
  const timeTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, timeTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,    // target
    0,                // level
    gl.ALPHA,         // internal format
    texWidth,         // width
    texHeight,        // height
    0,                // border
    gl.ALPHA,         // format
    gl.UNSIGNED_BYTE, // type
    timeData,         // data
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindBuffer(gl.TEXTURE_2D, null);


  const freqData = new Uint8Array(texWidth * texHeight);
  for (let i = 0; i < freqData.length; i += 1) { freqData[i] = 128; }
  const freqTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, freqTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,    // target
    0,                // level
    gl.ALPHA,         // internal format
    texWidth,         // width
    texHeight,        // height
    0,                // border
    gl.ALPHA,         // format
    gl.UNSIGNED_BYTE, // type
    freqData,         // data
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindBuffer(gl.TEXTURE_2D, null);

  const texCoords = new Float32Array(FREQ_BIN_COUNT);
  for (let i = 0; i < texCoords.length; i += 1) {
    texCoords[i] = i / FREQ_BIN_COUNT;
  }
  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return {
    update() {},
    render() {},
  };
}

export default {};
