import { mat4, vec3 } from "gl-matrix";

import Geometry from "../geometry";
import Mesh from "../mesh";
import Program from "../program";
import Scene from "../scene";
import Song from "../redux/song_redux";
import Store from "../store";
import Utils from "../utils";
import spiralFragmentSrc from "../shaders/spiral.frag";
import spiralVertexSrc from "../shaders/spiral.vert";
import { FFT_SIZE } from "./song_sagas";

const TIME_DOMAIN_LENGTH = FFT_SIZE;
const FREQ_DOMAIN_LENGTH = FFT_SIZE / 2;
const TEXTURE_HEIGHT = 3;

class SpiralMesh extends Mesh {
  constructor({ gl, geometry, program }) {
    super({ gl, geometry, program });
    this.inst = gl.getExtension("ANGLE_instanced_arrays");
    this.a = 5.0;
    this.b = 0.2;
    this.s = 100.0;
    this.createBuffers();
    this.createTextures();
    mat4.scale(this.transform, this.transform, vec3.fromValues(0.007, 0.007, 0.007));
  }

  createTextures() {
    const gl = this.gl;

    this.timeTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.timeTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const blankTimeData = new Uint8Array(TIME_DOMAIN_LENGTH * TEXTURE_HEIGHT);
    blankTimeData.fill(1);
    this.updateTextureData(this.timeTexture, TIME_DOMAIN_LENGTH, TEXTURE_HEIGHT, blankTimeData);

    this.freqTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.freqTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const blankFreqData = new Uint8Array(FREQ_DOMAIN_LENGTH * TEXTURE_HEIGHT);
    blankFreqData.fill(1);
    this.updateTextureData(this.freqTexture, FREQ_DOMAIN_LENGTH, TEXTURE_HEIGHT, blankFreqData);
  }

  updateTextures(analyzers) {
    const channel1 = 0;
    const channel2 = (channel1 + 1) % analyzers.length;

    const timeEqData = new Array(analyzers.length);
    const freqEqData = new Array(analyzers.length);
    let shortestFFT = 16384;
    let shortestFBC = 16384;
    for (let i = 0; i < analyzers.length; i += 1) {
      if (analyzers[i].fftSize < shortestFFT) {
        shortestFFT = analyzers[i].fftSize;
      }
      if (analyzers[i].frequencyBinCount < shortestFBC) {
        shortestFBC = analyzers[i].frequencyBinCount;
      }
      timeEqData[i] = new Uint8Array(analyzers[i].fftSize);
      analyzers[i].getByteTimeDomainData(timeEqData[i]);
      freqEqData[i] = new Uint8Array(analyzers[i].frequencyBinCount);
      analyzers[i].getByteFrequencyData(freqEqData[i]);
    }

    const timeTexData = new Uint8Array(TIME_DOMAIN_LENGTH * TEXTURE_HEIGHT);
    timeTexData.fill(0);
    for (let i = 0; i < TIME_DOMAIN_LENGTH && i < shortestFFT; i += 1) {
      timeTexData[i] = timeEqData[channel1][i];
      timeTexData[((TEXTURE_HEIGHT - 1) * TIME_DOMAIN_LENGTH) + i] = timeEqData[channel2][i];
    }

    const freqTexData = new Uint8Array(FREQ_DOMAIN_LENGTH * TEXTURE_HEIGHT);
    freqTexData.fill(0);
    for (let i = 0; i < FREQ_DOMAIN_LENGTH && i < shortestFBC; i += 1) {
      freqTexData[i] = freqEqData[channel1][i];
      freqTexData[((TEXTURE_HEIGHT - 1) * FREQ_DOMAIN_LENGTH) + i] = freqEqData[channel2][i];
    }

    this.updateTextureData(this.timeTexture, TIME_DOMAIN_LENGTH, TEXTURE_HEIGHT, timeTexData);
    this.updateTextureData(this.freqTexture, FREQ_DOMAIN_LENGTH, TEXTURE_HEIGHT, freqTexData);
  }

  updateTextureData(texture, width, height, bytes) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,    // target
      0,                // level
      gl.ALPHA,         // internal format
      width,            // width
      height,           // height
      0,                // border
      gl.ALPHA,         // format
      gl.UNSIGNED_BYTE, // type
      bytes,            // data
    );
  }

  createBuffers() {
    const gl = this.gl;
    this.texCoords = new Float32Array(FFT_SIZE);
    for (let i = 0; i < this.texCoords.length; i += 1) {
      this.texCoords[i] = i / FFT_SIZE;
    }
    this.texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.texCoords, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  setUpUniforms(matrices) {
    const gl = this.gl;
    super.setUpUniforms(matrices);

    const timeLocation = this.program.uniforms.time_domain;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.timeTexture);
    gl.uniform1i(timeLocation, 0);

    const freqLocation = this.program.uniforms.freq_domain;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.freqTexture);
    gl.uniform1i(freqLocation, 1);

    const aLocation = this.program.uniforms.spiral_a;
    gl.uniform1f(aLocation, this.a);
    const bLocation = this.program.uniforms.spiral_b;
    gl.uniform1f(bLocation, this.b);
    const sLocation = this.program.uniforms.spiral_s;
    gl.uniform1f(sLocation, this.s);
  }

  draw() {
    const gl = this.gl;
    const inst = this.inst;

    this.geometry.bindBuffers();
    this.geometry.setUpAttributes(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.enableVertexAttribArray(this.program.attributes.tex_coord);
    gl.vertexAttribPointer(this.program.attributes.tex_coord, 1, gl.FLOAT, false, 4, 0);
    inst.vertexAttribDivisorANGLE(this.program.attributes.tex_coord, 1);
    inst.drawElementsInstancedANGLE(
      gl.TRIANGLES,
      this.geometry.elements.length,
      gl.UNSIGNED_SHORT,
      0,
      this.texCoords.length);
    this.geometry.unbindBuffers();
  }
}

export function spiral(gl) {
  const geometry = Geometry.cube({ gl });
  geometry.createBuffers();

  const program = new Program({
    gl,
    vertexSource: spiralVertexSrc,
    fragmentSource: spiralFragmentSrc,
  });

  const mesh = new SpiralMesh({ gl, geometry, program });

  const { canvasWidth, canvasHeight } = Utils.getDimensions();
  const scene = new Scene({ gl, canvasWidth, canvasHeight });
  scene.addMesh(mesh);

  return {
    update() {
      const pipeline = Song.Selectors.getAudioPipeline(Store.getState()).toJS();
      if (pipeline && pipeline.analyzers) {
        mesh.updateTextures(pipeline.analyzers);
      }

      const angle = (2 * 3.1415926) / (30 * 60);
      const axis = vec3.fromValues(0.0, 0.0, 1.0);
      mat4.rotate(mesh.transform, mesh.transform, angle, axis);
    },

    render() {
      const { width, height } = Utils.getDimensions();
      scene.setViewport(width, height);
      scene.render();
    },
  };
}

export default {};
