#version 100

attribute vec2 tex_coord;

void main(void) {
  vec2 tf_tex_coord = (tex_coord * 2.0) + vec2(-1.0, -1.0);
  gl_Position = vec4(tf_tex_coord, 0.0, 1.0);
  gl_PointSize = 1.0;
}
