#version 300 es

in vec3 position;
in vec2 tex_coord;

out vec2 frag_tex_coord;

void main(void) {
  frag_tex_coord = tex_coord;
  gl_Position = vec4(position, 1.0);
}
