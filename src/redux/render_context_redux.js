import * as R from "ramda";
import { createNamespacedSelectors } from "../namespaced_selectors";

const namespace = "renderContext";

const Types = R.indexBy(R.identity, [
  "CREATE_CANVAS",
  "CREATE_OPENGL_CONTEXT",
  "CREATE_OPENGL_EXTENSION",
  "RESIZE_CANVAS",
  "RESIZE_COMPLETED",
]);

const Actions = {
  createCanvas: (canvas) => ({ type: Types.CREATE_CANVAS, canvas }),
  createOpenGLContext: (gl) => ({ type: Types.CREATE_OPENGL_CONTEXT, gl }),
  createOpenGLExtension: (name, ext) => ({ type: Types.CREATE_OPENGL_EXTENSION, name, ext }),
  resizeCanvas: (width, height) => ({ type: Types.RESIZE_CANVAS, width, height }),
  resizeCompleted: () => ({ type: Types.RESIZE_COMPLETED }),
};

const Reducers = {
  createCanvas: (state, { canvas }) => R.assoc("canvas", canvas, state),
  createOpenGLContext: (state, { gl }) => R.assoc("gl", gl, state),
  createOpenGLExtension: (state, { name, ext }) => R.assoc(name, ext, state),
  resizeCanvas: (state, { width, height }) => R.mergeLeft({ width, height, resize: true }, state),
  resizeCompleted: (state) => R.assoc("resize", false, state),
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
      return {
        canvas: null,
        gl: null,
        width: 100,
        height: 100,
        resize: false,
      };
    }
    return state;
  }
}

const NoNsSelectors = {
  getCanvas: R.prop("canvas"),
  getDimensions: R.pick(["width", "height"]),
  getGlContext: R.prop("gl"),
  getGlExtension: R.pipe(R.flip(R.prop), R.defaultTo(null)),
  isResizing: R.prop("resize"),
};
const Selectors = createNamespacedSelectors(namespace, NoNsSelectors);

export default {
  Types,
  Actions,
  Reducers,
  Selectors,
  namespace,
  rootReducer,
};
