#version 100
#extension GL_EXT_draw_buffers : require

precision mediump float;

varying vec2 frag_tex_coord;

uniform sampler2D positions;
uniform sampler2D velocities;
uniform sampler2D colors;
uniform float dt;

void main(void) {
  vec3 position0 = texture2D(positions, frag_tex_coord).rgb;
  vec3 velocity0 = texture2D(velocities, frag_tex_coord).rgb;
  vec4 color = texture2D(colors, frag_tex_coord);

  vec3 cg = vec3(-1.0, -1.0, 0.0);
  vec3 radius = cg - position0;

  vec3 force = (10.0 / dot(radius, radius)) * normalize(radius);
  vec3 accel = force;

  vec3 velocity1 = velocity0 + (accel * dt);
  vec3 position1 = position0 + (velocity0 * dt) + (0.5 * accel * dt * dt);

  gl_FragData[0] = vec4(position1, 1.0);
  gl_FragData[1] = vec4(velocity1, 1.0);
  gl_FragData[2] = color;
}
