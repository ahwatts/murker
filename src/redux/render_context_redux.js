import Immutable from "immutable";
import R from "ramda";

const namespace = "renderContext";

const Types = R.indexBy(R.identity, [
  "CREATE_CANVAS",
  "CREATE_OPENGL_CONTEXT",
  "CREATE_OPENGL_EXTENSION",
  "RESIZE_CANVAS",
  "RESIZE_COMPLETED",
]);

const Actions = {
  createCanvas: canvas => ({ type: Types.CREATE_CANVAS, canvas }),
  createOpenGLContext: gl => ({ type: Types.CREATE_OPENGL_CONTEXT, gl }),
  createOpenGLExtension: (name, ext) => ({ type: Types.CREATE_OPENGL_EXTENSION, name, ext }),
  resizeCanvas: (width, height) => ({ type: Types.RESIZE_CANVAS, width, height }),
  resizeCompleted: () => ({ type: Types.RESIZE_COMPLETED }),
};

const Reducers = {
  createCanvas: (state, { canvas }) => state.merge({ canvas }),
  createOpenGLContext: (state, { gl }) => state.merge({ gl }),
  createOpenGLExtension: (state, { name, ext }) => state.merge({ [name]: ext }),
  resizeCanvas: (state, { width, height }) => state.merge({ width, height, resize: true }),
  resizeCompleted: state => state.set("resize", false),
};

function rootReducer(state, action) {
  switch (action.type) {
  case Types.CREATE_CANVAS:
    return Reducers.createCanvas(state, action);
  case Types.CREATE_OPENGL_CONTEXT:
    return Reducers.createOpenGLContext(state, action);
  case Types.CREATE_OPENGL_EXTENSION:
    return Reducers.createOpenGLExtension(state, action);
  case Types.RESIZE_CANVAS:
    return Reducers.resizeCanvas(state, action);
  case Types.RESIZE_COMPLETED:
    return Reducers.resizeCompleted(state, action);
  default:
    if (R.isNil(state)) {
      return Immutable.fromJS({
        canvas: null,
        gl: null,
        width: 100,
        height: 100,
        resize: false,
      });
    }
    return state;
  }
}

const Selectors = {
  getGlContext(state) {
    return state[namespace].get("gl");
  },

  getGlExtension(state, name) {
    return state[namespace].get(name);
  },

  getCanvas(state) {
    return state[namespace].get("canvas");
  },

  getDimensions(state) {
    const width = state[namespace].get("width");
    const height = state[namespace].get("height");
    return { width, height };
  },

  isResizing(state) {
    return state[namespace].get("resize");
  },
};

export default {
  Types,
  Actions,
  Reducers,
  Selectors,
  namespace,
  rootReducer,
};
