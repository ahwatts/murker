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
import { FREQ_BIN_COUNT } from "./song_sagas";

class SpiralMesh extends Mesh {
  constructor({ gl, geometry, program }) {
    super({ gl, geometry, program });
    this.inst = gl.getExtension("ANGLE_instanced_arrays");
    this.a = 10.0;
    this.b = 0.35;
    this.s = 0.1;
    this.createBuffers();
    this.createTextures();
    mat4.scale(this.transform, this.transform, vec3.fromValues(0.01, 0.01, 0.01));
  }

  createTextures() {
    const gl = this.gl;
    const texWidth = FREQ_BIN_COUNT;
    const texHeight = 3;

    const timeData = new Uint8Array(texWidth * texHeight);
    for (let i = 0; i < timeData.length; i += 1) { timeData[i] = 128; }
    this.timeTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.timeTexture);
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
    gl.bindTexture(gl.TEXTURE_2D, null);

    const freqData = new Uint8Array(texWidth * texHeight);
    for (let i = 0; i < freqData.length; i += 1) { freqData[i] = 128; }
    this.freqTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.freqTexture);
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
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  updateTextures(analyzers) {
    const gl = this.gl;
    const texWidth = FREQ_BIN_COUNT;
    const texHeight = 3;

    const timeData = new Uint8Array(texWidth * texHeight);
    const leftTimeData = new Uint8Array(texWidth);
    const rightTimeData = new Uint8Array(texWidth);
    analyzers[0].getByteTimeDomainData(leftTimeData);
    analyzers[1].getByteTimeDomainData(rightTimeData);

    for (let i = 0; i < FREQ_BIN_COUNT; i += 1) {
      timeData[i] = leftTimeData[i];
      timeData[texWidth + i] = 127;
      timeData[(2 * texWidth) + i] = rightTimeData[i];
    }

    gl.bindTexture(gl.TEXTURE_2D, this.timeTexture);
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

    const freqData = new Uint8Array(texWidth * texHeight);
    const leftFreqData = new Uint8Array(texWidth);
    const rightFreqData = new Uint8Array(texWidth);
    analyzers[0].getByteFrequencyData(leftFreqData);
    analyzers[1].getByteFrequencyData(rightFreqData);

    for (let i = 0; i < FREQ_BIN_COUNT; i += 1) {
      freqData[i] = leftFreqData[i];
      freqData[texWidth + i] = 127;
      freqData[(2 * texWidth) + i] = rightFreqData[i];
    }

    gl.bindTexture(gl.TEXTURE_2D, this.freqTexture);
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
  }

  createBuffers() {
    const gl = this.gl;
    this.texCoords = new Float32Array(FREQ_BIN_COUNT);
    for (let i = 0; i < this.texCoords.length; i += 1) {
      this.texCoords[i] = i / FREQ_BIN_COUNT;
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
        this.mesh.updateTextures(pipeline.analyzers);
      }
    },

    render() {
      const { width, height } = Utils.getDimensions();
      scene.setViewport(width, height);
      scene.render();
    },
  };
}

export default {};
