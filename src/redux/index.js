import { combineReducers } from "redux";

import Search from "./search_redux";
import RenderContext from "./render_context_redux";
import Song from "./song_redux";

const rootReducer = combineReducers({
  [Search.namespace]: Search.rootReducer,
  [RenderContext.namespace]: RenderContext.rootReducer,
  [Song.namespace]: Song.rootReducer,
});
export default rootReducer;
