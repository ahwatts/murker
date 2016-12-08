import Immutable from "immutable";
import { createStore } from "redux";
import murkerReducer from "./reducers";

const store = createStore(murkerReducer, Immutable.Map({
  gl: null,
  geometries: Immutable.Map({}),
  programs: Immutable.Map({}),
}));

export default store;
