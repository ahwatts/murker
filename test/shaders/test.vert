#version 100

attribute vec3 position;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
varying vec4 v_color;

void main(void) {
  gl_Position = projection * view * model * vec4(position, 1.0);
  v_color = vec4(abs(normalize(position)), 1.0);
}
