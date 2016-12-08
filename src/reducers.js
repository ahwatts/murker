export default (state, action) => {
  switch (action.type) {
  case "CREATED_WEBGL_CONTEXT":
    return state.set("gl", action.gl);
  default:
    return state;
  }
};
