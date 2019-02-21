#version 300 es

precision mediump float;

in vec3 position1;
in vec3 velocity1;
in vec4 color1;

out vec4 discarded;

void main(void) {
  discarded = vec4(1.0, 1.0, 1.0, 1.0);
}
