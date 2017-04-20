import { mat4 } from "gl-matrix";

import Camera from "./camera";

class Scene {
  constructor(vpWidth, vpHeight) {
    this.camera = new Camera();
    this.meshes = [];
    this.projection = mat4.create();
    this.setViewport(vpWidth, vpHeight);
  }

  addMesh(mesh) {
    this.meshes.push(mesh);
  }

  setViewport(newWidth, newHeight) {
    this.viewport = {
      width: newWidth,
      height: newHeight,
    };

    mat4.perspective(
      this.projection,
      Math.PI / 6.0,
      this.viewport.width / this.viewport.height,
      0.1,
      100.0);
  }

  render() {
    const view = this.camera.getViewTransform();
    const viewInv = mat4.create();
    const projection = this.projection;
    mat4.invert(viewInv, view);

    this.meshes.forEach((m) => {
      m.render({ projection, view, viewInv });
    });
  }
}

export default Scene;
