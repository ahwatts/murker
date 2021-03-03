/* eslint-env mocha */
/* eslint no-unused-expressions: off, max-len: off */

import { expect } from "chai";
import * as R from "ramda";
import { createNamespacedReducer } from "../../src/namespaced_selectors";
import RenderContext from "../../src/redux/render_context_redux";

describe("Render Context redux", () => {
  function createInitialState() {
    return RenderContext.rootReducer(null, {});
  }

  function createInitialNsState() {
    return {
      [RenderContext.namespace]: createInitialState(),
    };
  }

  const nsReducer = createNamespacedReducer(RenderContext.namespace, RenderContext.rootReducer);

  context("initial state", () => {
    it("should have a null canvas", () => {
      const state = createInitialState();
      expect(R.prop("canvas", state)).to.be.null;
    });

    it("should have a null OpenGL context", () => {
      const state = createInitialState();
      expect(R.prop("gl", state)).to.be.null;
    });

    it("should have a width > 0", () => {
      const state = createInitialState();
      expect(R.prop("width", state)).to.be.above(0);
    });

    it("should have a height > 0", () => {
      const state = createInitialState();
      expect(R.prop("height", state)).to.be.above(0);
    });

    it("should not be resizing", () => {
      const state = createInitialState();
      expect(R.prop("resize", state)).to.be.false;
    });
  });

  context("createCanvas reducer", () => {
    it("should set the canvas", () => {
      let state = createInitialState();
      state = RenderContext.rootReducer(state, RenderContext.Actions.createCanvas("dummy"));
      expect(R.prop("canvas", state)).to.equal("dummy");
    });
  });

  context("createOpenGLContext reducer", () => {
    it("should set the OpenGL context", () => {
      let state = createInitialState();
      state = RenderContext.rootReducer(state, RenderContext.Actions.createOpenGLContext("dummy"));
      expect(R.prop("gl", state)).to.equal("dummy");
    });
  });

  context("createOpenGLExtension reducer", () => {
    it("should set the extension", () => {
      let state = createInitialState();
      state = RenderContext.rootReducer(state, RenderContext.Actions.createOpenGLExtension("dummyName", "dummyExt"));
      expect(R.prop("dummyName", state)).to.equal("dummyExt");
    });
  });

  context("resizeCanvas reducer", () => {
    it("should set the new width and height", () => {
      let state = createInitialState();
      state = RenderContext.rootReducer(state, RenderContext.Actions.resizeCanvas(200, 300));
      expect(R.pick(["width", "height"], state)).to.deep.equal({ width: 200, height: 300 });
    });

    it("should set that a resize is in progress", () => {
      let state = createInitialState();
      state = RenderContext.rootReducer(state, RenderContext.Actions.resizeCanvas(200, 300));
      expect(R.prop("resize", state)).to.be.true;
    });
  });

  context("resizeCompleted reducer", () => {
    it("should set that the resize is no longer in progress", () => {
      let state = createInitialState();
      state = RenderContext.rootReducer(state, RenderContext.Actions.resizeCanvas(200, 300));
      state = RenderContext.rootReducer(state, RenderContext.Actions.resizeCompleted());
      expect(R.prop("resize", state)).to.be.false;
    });
  });

  context("getCanvas selector", () => {
    it("should initially return null", () => {
      const state = createInitialNsState();
      expect(RenderContext.Selectors.getCanvas(state)).to.be.null;
    });

    it("should return the context", () => {
      let state = createInitialNsState();
      state = nsReducer(state, RenderContext.Actions.createCanvas("dummy"));
      expect(RenderContext.Selectors.getCanvas(state)).to.equal("dummy");
    });
  });

  context("getDimensions selector", () => {
    it("should initially return 100x100", () => {
      const state = createInitialNsState();
      expect(RenderContext.Selectors.getDimensions(state)).to.deep.equal({ width: 100, height: 100 });
    });

    it("should return the dimensions", () => {
      let state = createInitialNsState();
      state = nsReducer(state, RenderContext.Actions.resizeCanvas(640, 480));
      expect(RenderContext.Selectors.getDimensions(state)).to.deep.equal({ width: 640, height: 480 });
    });
  });

  context("getGLContext selector", () => {
    it("should initially return null", () => {
      const state = createInitialNsState();
      expect(RenderContext.Selectors.getGlContext(state)).to.be.null;
    });

    it("should return the context", () => {
      let state = createInitialNsState();
      state = nsReducer(state, RenderContext.Actions.createOpenGLContext("dummy"));
      expect(RenderContext.Selectors.getGlContext(state)).to.equal("dummy");
    });
  });

  context("getGlExtension selector", () => {
    it("should initially return null", () => {
      const state = createInitialNsState();
      expect(RenderContext.Selectors.getGlExtension(state, "dummyName")).to.be.null;
    });

    it("should return the extension", () => {
      let state = createInitialNsState();
      state = nsReducer(state, RenderContext.Actions.createOpenGLExtension("dummyName", "dummyExt"));
      expect(RenderContext.Selectors.getGlExtension(state, "dummyName")).to.equal("dummyExt");
    });
  });

  context("isResizing selector", () => {
    it("should initially return false", () => {
      const state = createInitialNsState();
      expect(RenderContext.Selectors.isResizing(state)).to.be.false;
    });

    it("should return true if a resize is in progress", () => {
      let state = createInitialNsState();
      state = nsReducer(state, RenderContext.Actions.resizeCanvas(640, 480));
      expect(RenderContext.Selectors.isResizing(state)).to.be.true;
    });

    it("should return false if a resize is completed", () => {
      let state = createInitialNsState();
      state = nsReducer(state, RenderContext.Actions.resizeCanvas(640, 480));
      state = nsReducer(state, RenderContext.Actions.resizeCompleted());
      expect(RenderContext.Selectors.isResizing(state)).to.be.false;
    });
  });
});
