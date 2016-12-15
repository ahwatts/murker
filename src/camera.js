import { mat4, quat, vec3 } from "gl-matrix";
import R from "ramda";

class Camera {
  constructor(vecs) {
    this.defaultPosition = vec3.fromValues(0.0, 0.0, 5.0);
    this.defaultLookAt = vec3.fromValues(0.0, 0.0, 0.0);
    this.defaultUp = vec3.fromValues(0.0, 1.0, 0.0);

    this.position = vec3.create();
    this.lookAt = vec3.create();
    this.up = vec3.create();

    this.reset();

    if (!R.isNil(vecs)) {
      if (!R.isNil(vecs.position)) {
        vec3.copy(this.position, vecs.position);
      }

      if (!R.isNil(vecs.lookAt)) {
        vec3.copy(this.lookAt, vecs.lookAt);
      }

      if (!R.isNil(vecs.up)) {
        vec3.copy(this.up, vecs.up);
      }
    }
  }

  reset() {
    vec3.copy(this.position, this.defaultPosition);
    vec3.copy(this.lookAt, this.defaultLookAt);
    vec3.copy(this.up, this.defaultUp);
  }

  rotate(dtheta, dphi) {
    // Get the vector to the camera from the focus point.
    const cam = vec3.create();
    vec3.sub(cam, this.position, this.lookAt);

    // Normalize the camera-direction vector, maintaining its length.
    const rad = vec3.length(cam);
    vec3.normalize(cam, cam);

    // Rotate the camera-direction vector clockwise about the "up" axis.
    const rot = quat.create();
    quat.setAxisAngle(rot, this.up, -dtheta);
    vec3.transformQuat(cam, cam, rot);

    // Calculate the horizontal vector (the rotated x-axis).
    const xhat = vec3.create();
    vec3.cross(xhat, this.up, cam);
    vec3.normalize(xhat, xhat);

    // Rotate the camera-direction vector clockwise about the new horizontal vector.
    quat.setAxisAngle(rot, xhat, -dphi);
    vec3.transformQuat(cam, cam, rot);

    // Don't rotate beyond 90°.
    const angle = vec3.dot(cam, this.up);
    if (angle > 0.99863 || angle < -0.99863) {
      quat.setAxisAngle(rot, xhat, dphi);
      vec3.transformQuat(cam, cam, rot);
    }

    // Set the new position vector from the direction and the length.
    const newCam = vec3.clone(cam);
    vec3.scale(newCam, newCam, rad);
    vec3.add(this.position, this.lookAt, newCam);
  }

  zoom(dr) {
    const cam = vec3.create();
    vec3.sub(cam, this.position, this.lookAt);
    let r = vec3.length(cam);
    vec3.normalize(cam, cam);
    r += dr;
    vec3.scale(cam, cam, r);
    vec3.add(this.position, this.lookAt, cam);
  }

  getViewTransform() {
    const view = mat4.create();
    mat4.lookAt(view, this.position, this.lookAt, this.up);
    return view;
  }
}

export default Camera;
