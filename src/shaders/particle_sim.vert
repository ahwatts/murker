#version 300 es

layout(location = 0) in vec3 position0;
layout(location = 1) in vec3 velocity0;
layout(location = 2) in vec4 color0;

uniform vec3 cg_position;
uniform float cg_mass;

out vec3 position1;
out vec3 velocity1;
out vec4 color1;

void main(void) {
  vec3 radius = cg_position - position0;
  vec3 accel = (cg_mass / dot(radius, radius)) * normalize(radius);
  position1 = position0 + dt*(velocity0 + dt*(0.5*accel));
  velocity1 = velocity0 + dt*accel;
  color1 = vec4(abs(normalize(velocity1)), 1.0);
}
