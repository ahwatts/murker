import { combineReducers } from "redux";
import { rootRenderContextReducer as renderContext } from "./render_context";
import { rootSceneGraphReducer as sceneGraph } from "./scene_graph";

const rootReducer = combineReducers({ renderContext, sceneGraph });
export default rootReducer;

export function getGlContext(state) {
  return state.renderContext.get("gl");
}
