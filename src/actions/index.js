export function createdWebGLContext(gl) {
  return {
    type: 'CREATED_WEBGL_CONTEXT',
    gl,
  };
}

export default {};
