import Immutable from "immutable";
import R from "ramda";

export const CREATE_GEOMETRY = "CREATE_GEOMETRY";
export const CREATE_PROGRAM = "CREATE_PROGRAM";
export const ADD_MESH = "ADD_MESH";

export const SceneGraphActions = {
  createGeometry: (id, geo) => ({ type: CREATE_GEOMETRY, id, geo }),
  createProgram: (id, prog) => ({ type: CREATE_PROGRAM, id, prog }),
  addMesh: (id, geoId, progId) => ({ type: ADD_MESH, id, geoId, progId }),
};

export const SceneGraphReducers = {
  createGeometry: (state, { id, geo }) => state.setIn(["geometries", id], geo),
  createProgram: (state, { id, prog }) => state.setIn(["programs", id], prog),
};

export function rootSceneGraphReducer(state, action) {
  switch (action.type) {
  case CREATE_GEOMETRY:
    return SceneGraphReducers.createGeometry(state, action);
  case CREATE_PROGRAM:
    return SceneGraphReducers.createProgram(state, action);
  default:
    if (R.isNil(state)) {
      return Immutable.Map({
        geometries: Immutable.Map({}),
        programs: Immutable.Map({}),
      });
    }
    return state;
  }
}
