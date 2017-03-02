import Immutable from "immutable";
import R from "ramda";

export const CREATE_CANVAS = "CREATE_CANVAS";
export const CREATE_OPENGL_CONTEXT = "CREATE_OPENGL_CONTEXT";
export const RESIZE_CANVAS = "RESIZE_CANVAS";
export const RESIZE_COMPLETED = "RESIZE_COMPLETED";

export const RenderContextActions = {
  createCanvas: canvas => ({ type: CREATE_CANVAS, canvas }),
  createOpenGLContext: gl => ({ type: CREATE_OPENGL_CONTEXT, gl }),
  resizeCanvas: (width, height) => ({ type: RESIZE_CANVAS, width, height }),
  resizeCompleted: () => ({ type: RESIZE_COMPLETED }),
};

export const RenderContextReducers = {
  createCanvas: (state, { canvas }) => state.merge({ canvas }),
  createOpenGLContext: (state, { gl }) => state.merge({ gl }),
  resizeCanvas: (state, { width, height }) => state.merge({ width, height, resize: true }),
  resizeCompleted: state => state.set("resize", false),
};

export function rootRenderContextReducer(state, action) {
  switch (action.type) {
  case CREATE_CANVAS:
    return RenderContextReducers.createCanvas(state, action);
  case CREATE_OPENGL_CONTEXT:
    return RenderContextReducers.createOpenGLContext(state, action);
  case RESIZE_CANVAS:
    return RenderContextReducers.resizeCanvas(state, action);
  case RESIZE_COMPLETED:
    return RenderContextReducers.resizeCompleted(state, action);
  default:
    if (R.isNil(state)) {
      return Immutable.Map({
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
