/* eslint-env mocha */
/* eslint no-unused-expressions: off */

import { expect } from "chai";
import * as R from "ramda";
import { createNamespacedReducer } from "../../src/namespaced_selectors";
import Search from "../../src/redux/search_redux";

describe("Search redux", () => {
  function createInitialState() {
    return Search.rootReducer({ findSong: undefined }, {});
  }

  function createInitialNsState() {
    return {
      [Search.namespace]: createInitialState(),
    };
  }

  const nsReducer = createNamespacedReducer(Search.namespace, Search.rootReducer);

  context("initial state", () => {
    it("should not be fetching", () => {
      const state = createInitialState();
      expect(R.path(["findSong", "fetching"], state)).to.be.false;
    });

    it("should have an empty query", () => {
      const state = createInitialState();
      expect(R.path(["findSong", "query"], state)).to.equal("");
    });

    it("should have no results", () => {
      const state = createInitialState();
      expect(R.isEmpty(R.path(["findSong", "results"], state))).to.be.true;
    });

    it("should not have an error", () => {
      const state = createInitialState();
      expect(R.path(["findSong", "error"], state)).to.be.null;
    });
  });

  context("after a query has been submitted", () => {
    function createState() {
      const state = createInitialState();
      return Search.rootReducer(state, Search.Actions.findSongQuery("foo"));
    }

    it("should be fetching", () => {
      const state = createState();
      expect(R.path(["findSong", "fetching"], state)).to.be.true;
    });

    it("should have the query", () => {
      const state = createState();
      expect(R.path(["findSong", "query"], state)).to.equal("foo");
    });

    it("should have no results", () => {
      const state = createState();
      expect(R.isEmpty(R.path(["findSong", "results"], state))).to.be.true;
    });

    it("should not have an error", () => {
      const state = createState();
      expect(R.path(["findSong", "error"], state)).to.be.null;
    });
  });

  context("after results have returned", () => {
    function createState() {
      const state = createInitialState();
      return Search.rootReducer(state, Search.Actions.findSongResults(["song 1", "song 2"]));
    }

    it("should not be fetching", () => {
      const state = createState();
      expect(R.path(["findSong", "fetching"], state)).to.be.false;
    });

    it("should have results", () => {
      const state = createState();
      expect(R.path(["findSong", "results"], state)).to.deep.equal(["song 1", "song 2"]);
    });

    it("should not have an error", () => {
      const state = createState();
      expect(R.path(["findSong", "error"], state)).to.be.null;
    });
  });

  context("after an error has happened", () => {
    function createState() {
      const state = createInitialState();
      return Search.rootReducer(state, Search.Actions.findSongError("Failed to find songs"));
    }

    it("should not be fetching", () => {
      const state = createState();
      expect(R.path(["findSong", "fetching"], state)).to.be.false;
    });

    it("should not have results", () => {
      const state = createState();
      expect(R.isEmpty(R.path(["findSong", "results"], state))).to.be.true;
    });

    it("should have an error", () => {
      const state = createState();
      expect(R.path(["findSong", "error"], state)).to.equal("Failed to find songs");
    });
  });

  context("getQuery selector", () => {
    it("should initially return the empty string", () => {
      const state = createInitialNsState();
      expect(Search.Selectors.getQuery(state)).to.equal("");
    });

    it("should return the query after one has been submitted", () => {
      let state = createInitialNsState();
      state = nsReducer(state, Search.Actions.findSongQuery("foo"));
      expect(Search.Selectors.getQuery(state)).to.equal("foo");
    });

    it("should still return the query after results have come back", () => {
      let state = createInitialNsState();
      state = nsReducer(state, Search.Actions.findSongQuery("foo"));
      state = nsReducer(state, Search.Actions.findSongResults(["song 1", "song 2"]));
      expect(Search.Selectors.getQuery(state)).to.equal("foo");
    });

    it("should still return the query if an error comes back", () => {
      let state = createInitialNsState();
      state = nsReducer(state, Search.Actions.findSongQuery("foo"));
      state = nsReducer(state, Search.Actions.findSongError("Failed to find songs"));
      expect(Search.Selectors.getQuery(state)).to.equal("foo");
    });
  });
});
