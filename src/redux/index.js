import { combineReducers } from "redux";

import KeyPress from "./keypress_redux";
import RenderContext from "./render_context_redux";
import Search from "./search_redux";
import Song from "./song_redux";

const rootReducer = combineReducers({
  [KeyPress.namespace]: KeyPress.rootReducer,
  [RenderContext.namespace]: RenderContext.rootReducer,
  [Search.namespace]: Search.rootReducer,
  [Song.namespace]: Song.rootReducer,
});
export default rootReducer;
