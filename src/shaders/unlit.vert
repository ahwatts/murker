#version 100

attribute vec3 position;
attribute vec4 color;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

varying vec4 v_color;

void main(void) {
  gl_Position = projection * view * model * vec4(position, 1.0);
  v_color = color;
}
