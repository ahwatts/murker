#version 100

precision mediump float;

varying vec2 frag_tex_coord;

uniform sampler2D colors;

void main(void) {
  gl_FragColor = vec4(normalize(abs(texture2D(colors, frag_tex_coord).rgb)), 1.0);
}
