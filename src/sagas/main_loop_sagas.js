/* eslint no-bitwise: off, no-constant-condition: off, no-param-reassign: off */

import RenderContext from "../redux/render_context_redux";

export function doFrame(canvas, store, gl, onUpdate, onRender) {
  onUpdate();

  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  const resizing = RenderContext.Selectors.isResizing(store.getState());

  if (resizing) {
    canvas.style = `position: absolute; top: 0; left: 0; width: ${width}; height: ${height};`;
    canvas.width = width;
    canvas.height = height;
    store.dispatch(RenderContext.Actions.resizeCompleted());
  }

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, width, height);

  onRender();
}

export function startMainLoop(canvas, store, gl, onUpdate, onRender) {
  function wrappedDoFrame() {
    doFrame(canvas, store, gl, onUpdate, onRender);
    requestAnimationFrame(wrappedDoFrame);
  }
  requestAnimationFrame(wrappedDoFrame);
}

export default {};
