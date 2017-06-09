/* eslint-env mocha */
/* eslint no-unused-expressions: off, import/no-extraneous-dependencies: off */

import { expect } from "chai";

import Search from "../../src/redux/search_redux";

describe("Search redux", () => {
  context("initial state", () => {
    function createInitialState() {
      return Search.rootReducer(null, {});
    }

    it("should not be fetching", () => {
      expect(createInitialState().getIn(["findSong", "fetching"])).to.be.false;
    });

    it("should have an empty query", () => {
      expect(createInitialState().getIn(["findSong", "query"])).to.equal("");
    });

    it("should have no results", () => {
      expect(createInitialState().getIn(["findSong", "results"]).isEmpty()).to.be.true;
    });
  });

  context("after a query has been submitted", () => {
    function createState() {
      const initialState = Search.rootReducer(null, {});
      return Search.rootReducer(initialState, Search.Actions.findSongQuery("foo"));
    }

    it("should be fetching", () => {
      expect(createState().getIn(["findSong", "fetching"])).to.be.true;
    });

    it("should have the query", () => {
      expect(createState().getIn(["findSong", "query"])).to.equal("foo");
    });

    it("should have no results", () => {
      expect(createState().getIn(["findSong", "results"]).isEmpty()).to.be.true;
    });
  });
});
