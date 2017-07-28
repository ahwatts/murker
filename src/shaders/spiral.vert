#version 100

// attribute vec3 position;
attribute float tex_coord;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

uniform sampler2D time_domain;
uniform sampler2D freq_domain;

uniform float spiral_a;
uniform float spiral_b;
uniform float spiral_s;
uniform float spiral_dtheta;

varying vec4 v_color;

void main(void) {
  v_color = vec4(0.0, 0.0, 0.0, 1.0);

  float time_left  = texture2D(time_domain, vec2(tex_coord, 0.0)).a;
  float time_right = texture2D(time_domain, vec2(tex_coord, 1.0)).a;
  float freq_left  = texture2D(freq_domain, vec2(tex_coord, 0.0)).a;
  float freq_right = texture2D(freq_domain, vec2(tex_coord, 1.0)).a;

  time_left  = (time_left  - 0.5) * 2.0;
  time_right = (time_right - 0.5) * 2.0;

  float time = (time_left + time_right) / 2.0;
  float freq = (freq_left + freq_right) / 2.0;

  float angle = spiral_dtheta * tex_coord;
  float radius = spiral_a + spiral_b * angle;
  vec3 position = vec3(radius*sin(angle), radius*cos(angle),
                       time * freq * spiral_s);

  gl_Position = projection * view * model * vec4(position, 1.0);
  gl_PointSize = 4.0;
  v_color = vec4(abs(time_left), abs(time_right), freq, 1.0);
}
