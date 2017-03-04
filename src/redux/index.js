import { combineReducers } from "redux";

import RenderContext from "./render_context";

const rootReducer = combineReducers({
  renderContext: RenderContext.rootReducer,
});
export default rootReducer;

export function getGlContext(state) {
  return state.renderContext.get("gl");
}

export function getCanvas(state) {
  return state.renderContext.get("canvas");
}

export function getDimensions(state) {
  const width = state.renderContext.get("width");
  const height = state.renderContext.get("height");
  return { width, height };
}

export function isResizing(state) {
  return state.renderContext.get("resize");
}
