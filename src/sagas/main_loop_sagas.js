/* eslint no-bitwise: off, no-constant-condition: off, no-param-reassign: off */

import RenderContext from "../redux/render_context_redux";
import store from "../store";

export function doFrame(canvas, gl, onUpdate, onRender) {
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

export function startMainLoop(canvas, gl, onUpdate, onRender) {
  const wrappedDoFrame = () => {
    doFrame(canvas, gl, onUpdate, onRender);
    requestAnimationFrame(wrappedDoFrame);
  };
  wrappedDoFrame();
}

export default {};
