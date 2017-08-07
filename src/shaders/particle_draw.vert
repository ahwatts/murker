#version 100

attribute vec2 tex_coord;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

uniform sampler2D positions;
uniform sampler2D colors;

varying vec4 color;

void main(void) {
  vec3 position = texture2D(positions, tex_coord).rgb;
  gl_Position = projection * view * model * vec4(position, 1.0);
  color = texture2D(colors, tex_coord);
  gl_PointSize = 1.0;
}
