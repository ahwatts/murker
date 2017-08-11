#version 100
#extension GL_EXT_draw_buffers : require

precision mediump float;

uniform sampler2D positions;
uniform sampler2D momenta;
uniform sampler2D colors;
uniform float dt;
uniform vec2 resolution;

void main(void) {
  vec2 frag_tex_coord = gl_FragCoord.xy / resolution;
  vec3 position0 = texture2D(positions, frag_tex_coord).rgb;
  vec3 momentum0 = texture2D(momenta, frag_tex_coord).rgb;
  vec4 color = texture2D(colors, frag_tex_coord);

  // vec3 dpdt = vec3(0.0, 0.0, 0.0); // no force.
  // vec3 dxdt = momentum0; // / mass, but mass = 1.0.

  // vec3 position1 = position0 + (dxdt * dt) + (0.5 * dpdt * dt * dt);
  // vec3 momentum1 = momentum0 + (dpdt * dt);

  gl_FragData[0] = vec4(position0, 1.0);
  gl_FragData[1] = vec4(momentum0, 1.0);
  gl_FragData[2] = color;
}
