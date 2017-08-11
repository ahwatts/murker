#version 100

attribute vec3 position;
attribute vec2 tex_coord;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

varying vec2 frag_tex_coord;

void main(void) {
  frag_tex_coord = tex_coord;
  gl_Position = projection * view * model * vec4(position, 1.0);
}
