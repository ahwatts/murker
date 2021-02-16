import { mat3, mat4 } from "gl-matrix";

class Mesh {
  constructor({ gl, geometry, program }) {
    this.gl = gl;
    this.geometry = geometry;
    this.program = program;
    this.transform = mat4.create();
  }

  bindProgram() {
    this.gl.useProgram(this.program.program);
  }

  unbindProgram() {
    this.gl.useProgram(null);
  }

  setUpUniforms({ projection, view, viewInv }) {
    const { gl } = this;

    if (this.program.uniforms.projection && projection) {
      gl.uniformMatrix4fv(this.program.uniforms.projection, false, projection);
    }

    if (this.program.uniforms.view && view) {
      gl.uniformMatrix4fv(this.program.uniforms.view, false, view);
    }

    if (this.program.uniforms.view_inv && viewInv) {
      gl.uniformMatrix4fv(this.program.uniforms.view_inv, false, viewInv);
    }

    if (this.program.uniforms.model) {
      gl.uniformMatrix4fv(this.program.uniforms.model, false, this.transform);
    }

    if (this.program.uniforms.model_inv_trans_3) {
      const modelInvTrans3 = mat3.create();
      mat3.fromMat4(modelInvTrans3, this.transform);
      mat3.invert(modelInvTrans3, modelInvTrans3);
      mat3.transpose(modelInvTrans3, modelInvTrans3);
      gl.uniformMatrix4fv(this.program.uniforms.view, false, modelInvTrans3);
    }
  }

  draw() {
    this.geometry.render(this.program);
  }

  render(matrices) {
    this.bindProgram();
    this.setUpUniforms(matrices);
    this.draw();
    this.unbindProgram();
  }
}

export default Mesh;
