#version 300 es
// #extension GL_EXT_draw_buffers : require

precision mediump float;

in vec2 frag_tex_coord;

uniform sampler2D positions;
uniform sampler2D velocities;
uniform sampler2D colors;
uniform float dt;

out vec4[3] frag_data;

void main(void) {
  vec3 position0 = texture(positions, frag_tex_coord).rgb;
  vec3 velocity0 = texture(velocities, frag_tex_coord).rgb;
  vec4 color = texture(colors, frag_tex_coord);

  vec3 cg = vec3(-1.0, -1.0, 0.0);
  vec3 radius = cg - position0;

  vec3 force = (10.0 / dot(radius, radius)) * normalize(radius);
  vec3 accel = 0.1 * force;

  vec3 velocity1 = velocity0 + (accel * dt);
  vec3 position1 = position0 + (velocity0 * dt) + (0.5 * accel * dt * dt);

  frag_data[0] = vec4(position1, 1.0);
  frag_data[1] = vec4(velocity1, 1.0);
  frag_data[2] = color;
}
