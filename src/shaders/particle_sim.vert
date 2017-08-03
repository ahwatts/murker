#version 100

attribute vec2 tex_coord;

void main(void) {
  gl_Position = vec4(tex_coord, 0.0, 1.0);
}
