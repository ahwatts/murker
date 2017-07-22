#version 100

attribute vec3 position;
attribute float tex_coord;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

uniform sampler2D time_domain;
uniform sampler2D freq_domain;

uniform float spiral_a;
uniform float spiral_b;
uniform float spiral_s;

varying vec4 v_color;

void main(void) {
  vec4 time_left  = texture2D(time_domain, vec2(tex_coord, 0.0));
  vec4 time_right = texture2D(time_domain, vec2(tex_coord, 1.0));
  vec4 freq_left  = texture2D(freq_domain, vec2(tex_coord, 0.0));
  vec4 freq_right = texture2D(freq_domain, vec2(tex_coord, 1.0));

  float time = length(vec2(time_left.a, time_right.a));
  float freq = length(vec2(freq_left.a, freq_right.a));

  float angle = 2.0 * 3.1415926 * 100.0 * tex_coord;
  float radius = spiral_a + spiral_b * angle;
  vec4 base = vec4(radius*cos(angle), radius*sin(angle),
                   time * freq * spiral_s, 1.0);

  gl_Position = projection * view * model * (base + vec4(position, 1.0));
  v_color = vec4(1.0, 1.0, 1.0, 1.0);
}
