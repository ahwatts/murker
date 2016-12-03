/* eslint no-unused-vars: off */

export default (state, action) => {
  switch (action.type) {
  case 'CREATED_WEBGL_CONTEXT':
    return Object.assign({}, state, { gl: action.gl });
  default:
    return state;
  }
};
