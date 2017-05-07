import { combineReducers } from "redux";

import FindSong from "./find_song";
import RenderContext from "./render_context";
import Song from "./song";

const rootReducer = combineReducers({
  [FindSong.namespace]: FindSong.rootReducer,
  [RenderContext.namespace]: RenderContext.rootReducer,
  [Song.namespace]: Song.rootReducer,
});
export default rootReducer;
