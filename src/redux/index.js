import { combineReducers } from "redux";
import { rootRenderContextReducer as renderContext } from "./render_context";
import { rootSceneGraphReducer as sceneGraph } from "./scene_graph";

const rootReducer = combineReducers({ renderContext, sceneGraph });
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
