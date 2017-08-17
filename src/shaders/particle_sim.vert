#version 100

attribute vec3 position;
attribute vec2 tex_coord;

varying vec2 frag_tex_coord;

void main(void) {
  frag_tex_coord = tex_coord;
  gl_Position = vec4(position, 1.0);
}
