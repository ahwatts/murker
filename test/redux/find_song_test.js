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
  });
});
