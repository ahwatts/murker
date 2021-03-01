/* eslint-env mocha */
/* eslint no-unused-expressions: off */

import { expect } from "chai";
import KeyPress from "../../src/redux/keypress_redux";
import { createNamespacedReducer } from "../../src/namespaced_selectors";

describe("Keypress redux", () => {
  function createInitialState() {
    return KeyPress.rootReducer(null, {});
  }

  const nsReducer = createNamespacedReducer(KeyPress.namespace, KeyPress.rootReducer);

  function createInitialNsState() {
    return {
      [KeyPress.namespace]: createInitialState(),
    };
  }

  context("initial state", () => {
    it("should not have any keys marked as down (no namespace)", () => {
      expect(createInitialState()).to.deep.equal({});
    });

    it("should not have any keys marked as down (namespaced)", () => {
      const initialState = createInitialState();
      const nsState = createInitialNsState();
      expect(nsState).to.deep.equal({ [KeyPress.namespace]: initialState });
    });
  });

  context("keyDown event", () => {
    it("should register the key as down", () => {
      let state = createInitialState();
      state = KeyPress.rootReducer(state, KeyPress.Actions.keyDown("KeyA"));
      expect(state).to.deep.equal({ KeyA: "down" });
    });

    it("should re-register a previously up key as down", () => {
      let state = createInitialState();
      state = KeyPress.rootReducer(state, KeyPress.Actions.keyUp("KeyA"));
      state = KeyPress.rootReducer(state, KeyPress.Actions.keyDown("KeyA"));
      expect(state).to.deep.equal({ KeyA: "down" });
    });

    it("should register multiple keys as down at the same time", () => {
      let state = createInitialState();
      state = KeyPress.rootReducer(state, KeyPress.Actions.keyDown("KeyA"));
      state = KeyPress.rootReducer(state, KeyPress.Actions.keyDown("KeyB"));
      expect(state).to.deep.equal({ KeyA: "down", KeyB: "down" });
    });

    it("should not register anything if the code is null", () => {
      const initialState = createInitialState();
      const state = KeyPress.rootReducer(initialState, KeyPress.Actions.keyDown(null));
      expect(state).to.deep.equal(initialState);
    });

    it("should not register anything if the code is undefined", () => {
      const initialState = createInitialState();
      const state = KeyPress.rootReducer(initialState, KeyPress.Actions.keyDown());
      expect(state).to.deep.equal(initialState);
    });
  });

  context("keyUp event", () => {
    it("should register the key as up", () => {
      const initialState = createInitialState();
      const state = KeyPress.rootReducer(initialState, KeyPress.Actions.keyUp("KeyA"));
      expect(state).to.deep.equal({ KeyA: "up" });
    });

    it("should re-register a previously down key as up", () => {
      let state = createInitialState();
      state = KeyPress.rootReducer(state, KeyPress.Actions.keyDown("KeyA"));
      state = KeyPress.rootReducer(state, KeyPress.Actions.keyUp("KeyA"));
      expect(state).to.deep.equal({ KeyA: "up" });
    });

    it("should register multiple keys as up at the same time", () => {
      let state = createInitialState();
      state = KeyPress.rootReducer(state, KeyPress.Actions.keyUp("KeyA"));
      state = KeyPress.rootReducer(state, KeyPress.Actions.keyUp("KeyB"));
      expect(state).to.deep.equal({ KeyA: "up", KeyB: "up" });
    });

    it("should not register anything if the code is null", () => {
      const initialState = createInitialState();
      const state = KeyPress.rootReducer(initialState, KeyPress.Actions.keyUp(null));
      expect(state).to.deep.equal(initialState);
    });

    it("should not register anything if the code is undefined", () => {
      const initialState = createInitialState();
      const state = KeyPress.rootReducer(initialState, KeyPress.Actions.keyUp());
      expect(state).to.deep.equal(initialState);
    });
  });

  context("keyState selector", () => {
    it("should be up without any action", () => {
      const initialState = createInitialNsState();
      expect(KeyPress.Selectors.keyState(initialState, "KeyA")).to.equal("up");
    });

    it("should be down after keyDown", () => {
      const initialState = createInitialNsState();
      const state = nsReducer(initialState, KeyPress.Actions.keyDown("KeyA"));
      expect(KeyPress.Selectors.keyState(state, "KeyA")).to.equal("down");
    });
  });

  context("isKeyDown selector", () => {
    it("should be false without any action", () => {
      const initialState = createInitialNsState();
      expect(KeyPress.Selectors.isKeyDown(initialState, "KeyA")).to.be.false;
    });

    it("should be true if a key is down", () => {
      const initialState = createInitialNsState();
      const state = nsReducer(initialState, KeyPress.Actions.keyDown("KeyA"));
      expect(KeyPress.Selectors.isKeyDown(state, "KeyA")).to.be.true;
    });

    it("should be false if a key comes back up", () => {
      const initialState = createInitialNsState();
      let state = nsReducer(initialState, KeyPress.Actions.keyDown("KeyA"));
      state = nsReducer(state, KeyPress.Actions.keyUp("KeyA"));
      expect(KeyPress.Selectors.isKeyDown(state, "KeyA")).to.be.false;
    });
  });
});
