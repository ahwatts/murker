/* eslint-env mocha */
/* eslint no-unused-expressions: off, import/no-extraneous-dependencies: off */

import { expect } from "chai";

import FindSong from "../../src/redux/find_song";

describe("FindSong redux", () => {
  context("initial state", () => {
    function createInitialState() {
      return FindSong.rootReducer(null, {});
    }

    it("should not be fetching", () => {
      expect(createInitialState().get("fetching")).to.be.false;
    });

    it("should have an empty query", () => {
      expect(createInitialState().get("query")).to.equal("");
    });

    it("should have no results", () => {
      expect(createInitialState().get("results").isEmpty()).to.be.true;
    });
  });

  context("after a query has been submitted", () => {
    function createState() {
      const initialState = FindSong.rootReducer(null, {});
      return FindSong.rootReducer(initialState, FindSong.Actions.findSongQuery("foo"));
    }

    it("should be fetching", () => {
      expect(createState().get("fetching")).to.be.true;
    });

    it("should have the query", () => {
      expect(createState().get("query")).to.equal("foo");
    });

    it("should have no results", () => {
      expect(createState().get("results").isEmpty()).to.be.true;
    });
  });
});
